import {RequestOptions as HttpRequestOptions, IncomingMessage, request as httpRequest} from 'http';
import {request as httpsRequest, RequestOptions as HttpsRequestOptions} from 'https';
import {connect as http2Connect, ClientHttp2Session} from 'http2';
import {Socket} from 'net';
import {Writable} from 'stream';

export enum ConnectionType {
	HTTP1,
	HTTP2
}

export class ManagedConnection {
	readonly #hostAndPort: string;
	readonly #type: ConnectionType;
	readonly #socket: Socket;
	#http2Session: ClientHttp2Session|null;
	#activeRequests: number;
	#ended: boolean;

	get hostAndPort() { return this.#hostAndPort; }
	get type() { return this.#type; }
	get socket() { return this.#socket; }
	get ended() { return this.#ended; }

	constructor(hostAndPort: string, type: ConnectionType, socket: Socket) {
		this.#hostAndPort = hostAndPort;
		this.#type = type;
		this.#socket = socket;
		this.#activeRequests = 0;
		this.#http2Session = null;

		socket.unref();

		if (type == ConnectionType.HTTP2) {
			this.#http2Session = http2Connect(`https://${hostAndPort}`, {
				createConnection: () => socket
			});
		}

		this.#ended = false;
		socket.on('end', () => this.#ended = true);
	}

	isReady(): boolean {
		if (this.#type == ConnectionType.HTTP1) {
			return this.#activeRequests == 0;
		}

		// TODO make this smarter
		return this.#activeRequests < 5;
	}

	request(options: HttpRequestOptions|HttpsRequestOptions, onResponse: (res: IncomingMessage) => void): Writable {
		if (this.#type == ConnectionType.HTTP1 && this.#activeRequests > 0) {
			throw new Error(`HTTP/1 socket ${this.#socket.remoteAddress}:${this.#socket.remotePort} already has ${this.#activeRequests} active request(s)`);
		}

		this.#activeRequests++;
		this.#socket.ref();

		let innerOnResponse = (res: IncomingMessage) => {
			res.on('end', () => this._responseFinished());
			onResponse(res);
		};

		if (this.#type == ConnectionType.HTTP1) {
			return this._http1Request(options, innerOnResponse);
		} else {
			return this._http2Request(options, innerOnResponse);
		}
	}

	_http1Request(options: HttpRequestOptions|HttpsRequestOptions, onResponse: (res: IncomingMessage) => void) {
		let reqFunc = options.protocol == 'http:' ? httpRequest : httpsRequest;
		return reqFunc(options, onResponse);
	}

	_http2Request(options: HttpRequestOptions|HttpsRequestOptions, onResponse: (res: IncomingMessage) => void) {
		let localHeaders:{[name: string]: any} = {};

		for (let i in (options.headers || {})) {
			localHeaders[i.toLowerCase()] = options.headers[i];
		}

		if (options.auth) {
			localHeaders.authorization = 'Bearer ' + Buffer.from(options.auth, 'utf8').toString('base64');
		}

		let authority = options.host || options.hostname;
		if (options.port && options.port != 443) {
			authority += `:${options.port}`;
		}

		if (localHeaders.host) {
			authority = localHeaders.host;
			delete localHeaders.host;
		}

		let stream = this.#http2Session.request({
			':scheme': 'https',
			':method': options.method.toUpperCase(),
			':authority': authority,
			':path': options.path,
			...localHeaders
		});

		stream.on('response', (headers) => {
			// @ts-ignore
			let incomingMessage = new IncomingMessage(stream);

			incomingMessage.headers = headers;

			incomingMessage.httpVersion = '2';
			incomingMessage.httpVersionMajor = 2;
			incomingMessage.httpVersionMinor = 0;

			incomingMessage.statusCode = headers[':status'];
			incomingMessage.statusMessage = '';

			onResponse(incomingMessage);

			stream.on('data', (chunk) => incomingMessage.push(chunk));
			stream.on('end', () => incomingMessage.push(null));
			stream.on('error', (err) => incomingMessage.destroy(err));
		});

		return stream;
	}

	_responseFinished() {
		this.#activeRequests--;

		if (this.#activeRequests == 0) {
			this.#socket.unref();
		}
	}
}
