import {EventEmitter} from 'events';
import {request as httpRequest, Agent as HttpAgent, RequestOptions as NodeRequestOptions} from 'http';
import {request as httpsRequest, Agent as HttpsAgent} from 'https';
import {stringify as encodeQueryString} from 'querystring';
import {createGunzip} from 'zlib';

import {HttpClientOptions, HttpRequestOptions, HttpResponse, MultipartFormObject} from './types';
import {clone} from '../../../objects';
import CookieJar from './CookieJar';
import {Readable} from 'stream';
import {randomBytes} from 'crypto';

const BODY_TYPES = ['body', 'urlEncodedForm', 'multipartForm', 'json'];
const METHODS_WITHOUT_BODY = ['GET', 'HEAD', 'OPTIONS', 'TRACE'];
const UTF8_PARSEABLE_CONTENT_TYPES = [
	// text/* is always considered parseable
	'application/json',
	'application/x-www-form-urlencoded',
	'application/xml',
	'application/xhtml+xml',
	'message/http' // for TRACE responses
];
const REDIRECT_STATUS_CODES = [301, 302, 303, 307, 308];

export default class HttpClient extends EventEmitter {
	cookieJar?: CookieJar;

	#httpAgent: HttpAgent;
	#httpsAgent: HttpsAgent;
	#localAddress?: string;
	#defaultHeaders: {[name: string]: string|number};
	#gzip: boolean;

	constructor(options?: HttpClientOptions) {
		super();

		options = options || {};

		this.#httpAgent = options.httpAgent || new HttpAgent({keepAlive: true});
		this.#httpsAgent = options.httpsAgent || new HttpsAgent({keepAlive: true});
		this.#localAddress = options.localAddress;
		this.#defaultHeaders = options.defaultHeaders || {};
		this.#gzip = options.gzip !== false;

		if (options.cookieJar) {
			this.cookieJar = options.cookieJar === true ? new CookieJar() : options.cookieJar;
		}
	}

	request(options: HttpRequestOptions): Promise<HttpResponse> {
		return new Promise((resolve, reject) => {
			options = preProcessOptions(options);
			createRequestBody(options);

			let nodeOptions = this.#decodeRequestOptions(options);
			let reqFunc = nodeOptions.protocol == 'http:' ? httpRequest : httpsRequest;
			this.emit('debug', 'request', `${nodeOptions.method} ${buildUrl(nodeOptions)}`, nodeOptions.headers);

			let req = reqFunc(nodeOptions, (res) => {
				let bodyChunks:Buffer[] = [];
				let responseStream:Readable = res;

				if (res.headers['content-encoding'] == 'gzip') {
					this.emit('debug', 'decompressing gzipped response');
					let gzipStream = createGunzip();
					responseStream.pipe(gzipStream);
					responseStream = gzipStream;
				}

				responseStream.on('data', chunk => bodyChunks.push(chunk));
				responseStream.on('end', () => {
					let response:HttpResponse = {
						statusCode: res.statusCode,
						statusMessage: res.statusMessage,
						url: buildUrl(nodeOptions),
						headers: res.headers as {[name: string]: string},
						rawBody: Buffer.concat(bodyChunks)
					};

					this.emit('debug', 'response', `${nodeOptions.method} ${buildUrl(nodeOptions)} ${res.statusCode} ${res.statusMessage} ${res.headers['content-type']}`);

					if (this.cookieJar) {
						let setCookieHeader = response.headers['set-cookie'] || [];
						if (!Array.isArray(setCookieHeader)) {
							setCookieHeader = [setCookieHeader];
						}
						setCookieHeader.forEach((setCookie) => {
							this.cookieJar.add(setCookie, nodeOptions.host);
						});
					}

					let contentType = (res.headers['content-type'] || '').split(';')[0].trim();
					if (contentType.startsWith('text/') || UTF8_PARSEABLE_CONTENT_TYPES.includes(contentType)) {
						response.textBody = response.rawBody.toString('utf8');
					}

					if (contentType == 'application/json') {
						try {
							response.jsonBody = JSON.parse(response.textBody);
						} catch (ex) {
							// don't care
						}
					}

					if (options.followRedirects && REDIRECT_STATUS_CODES.includes(res.statusCode) && res.headers.location) {
						let newRequest = clone(options);
						if ([301, 302, 303].includes(res.statusCode)) {
							// Change the method to GET
							newRequest.method = 'GET';
							newRequest.url = res.headers.location;
							delete newRequest.body;
							delete newRequest.headers['content-type'];
							delete newRequest.headers['content-length'];
							this.request(newRequest).then(resolve).catch(reject);
							return;
						}
					}

					resolve(response);
				});

				res.on('error', reject);
			});

			req.end(options.body);
			req.on('error', reject);
		});
	}

	#decodeRequestOptions(options: HttpRequestOptions): NodeRequestOptions {
		let nodeOptions:NodeRequestOptions = {};

		let url = new URL(options.url);

		let queryString = url.search;
		if (options.queryString) {
			if (queryString.length == 0) {
				queryString += '?';
			}

			if (!queryString.endsWith('?')) {
				// If the final character of our query string isn't "?", then we need to append a "&" to separate our new
				// options from existing options.
				queryString += '&';
			}

			queryString += encodeQueryString(options.queryString);
		}

		nodeOptions.protocol = url.protocol;
		nodeOptions.host = url.hostname;
		nodeOptions.port = getPort(url.port, url.protocol);
		nodeOptions.path = url.pathname + queryString;

		nodeOptions.method = options.method;
		nodeOptions.agent = url.protocol == 'http:' ? this.#httpAgent : this.#httpsAgent;
		nodeOptions.localAddress = this.#localAddress;
		nodeOptions.headers = {...this.#defaultHeaders, ...(options.headers || {})};

		if (this.cookieJar) {
			let cookieHeaderValue = this.cookieJar.getCookieHeaderForUrl(options.url);
			if (cookieHeaderValue.length > 0) {
				let existingCookieHeader = options.headers.cookie;
				nodeOptions.headers.cookie = (existingCookieHeader ? `${existingCookieHeader}; ` : '') + cookieHeaderValue;
			}
		}

		if (this.#gzip) {
			nodeOptions.headers['accept-encoding'] = 'gzip';
		}

		return nodeOptions;
	}

	static simpleObjectToMultipartForm(obj: {[name: string]: string|Buffer}): {[name: string]: MultipartFormObject} {
		let multipartForm:{[name: string]: MultipartFormObject} = {};
		for (let i in obj) {
			multipartForm[i] = {content: obj[i]};
		}
		return multipartForm;
	}
}

function getPort(portStr: string, protocol: string): number {
	let port:number = parseInt(portStr);
	if (isNaN(port) || port == 0) {
		return protocol == 'http:' ? 80 : 443;
	}

	return port;
}

export function preProcessOptions(options: HttpRequestOptions): HttpRequestOptions {
	// deep-clone the object so we don't cause any problems with implementation code
	options = clone(options);
	options.method = options.method.toUpperCase();
	options.headers = options.headers || {};

	// lowercase all the header names
	let normalizedHeaders:{[name: string]: any} = {};
	for (let i in options.headers) {
		let nameLower = i.toLowerCase();
		if (normalizedHeaders[nameLower]) {
			throw new Error(`Header "${nameLower}" appears in the headers object multiple times, with different capitalization`);
		}

		normalizedHeaders[nameLower] = options.headers[i];
	}

	options.headers = normalizedHeaders;

	// Only 1 body type may be specified. If more than 1 is present, that's an error.
	if (BODY_TYPES.filter(bt => typeof options[bt] != 'undefined').length > 1) {
		throw new Error('Multiple body types were specified. Only 1 of body, urlEncodedForm, multipartForm, json may be specified');
	}

	return options;
}

function createRequestBody(options: HttpRequestOptions): void {
	let bodyBuffer:Buffer = Buffer.alloc(0);

	if (options.body) {
		bodyBuffer = Buffer.isBuffer(options.body) ? options.body : Buffer.from(options.body, 'utf8');
	}

	if (options.urlEncodedForm) {
		bodyBuffer = Buffer.from(encodeQueryString(options.urlEncodedForm), 'utf8');
		options.headers['content-type'] = 'application/x-www-form-urlencoded';
	}

	if (options.json) {
		bodyBuffer = Buffer.from(JSON.stringify(options.json), 'utf8');
		options.headers['content-type'] = 'application/json';
	}

	if (options.multipartForm) {
		let boundary = '-----------------------------' + randomBytes(20).toString('hex');
		options.headers['content-type'] = `multipart/form-data; boundary=${boundary}`;

		let encodedBodyParts = [];
		for (let i in options.multipartForm) {
			let formObject = options.multipartForm[i];
			let head = `--${boundary}\r\nContent-Disposition: form-data; name="${i}"` +
				(formObject.filename ? `; filename="${formObject.filename}"` : '') +
				(formObject.contentType ? `\r\nContent-Type: ${formObject.contentType}` : '') +
				'\r\n\r\n';
			let tail = '\r\n';

			encodedBodyParts = encodedBodyParts.concat([
				Buffer.from(head, 'utf8'),
				Buffer.isBuffer(formObject.content) ? formObject.content : Buffer.from(formObject.content, 'utf8'),
				Buffer.from(tail, 'utf8')
			]);
		}

		encodedBodyParts.push(Buffer.from(`--${boundary}--\r\n`, 'utf8'));
		bodyBuffer = Buffer.concat(encodedBodyParts);
	}

	if (METHODS_WITHOUT_BODY.includes(options.method)) {
		if (bodyBuffer.length > 0) {
			throw new Error(`Requests with method "${options.method} may not have a request body`);
		}

		delete options.headers['content-type'];
		delete options.headers['content-length'];
		return;
	}

	delete options.urlEncodedForm;
	delete options.json;
	delete options.multipartForm;
	options.body = bodyBuffer;

	options.headers['content-length'] = options.body.length;
}

function buildUrl(urlObj: any): string {
	let portAppend = (urlObj.protocol == 'http:' && urlObj.port != 80) ||
		(urlObj.protocol == 'https:' && urlObj.port != 443);

	return `${urlObj.protocol}//${urlObj.host}${portAppend ? `:${urlObj.port}` : ''}${urlObj.path}`;
}
