import {Agent as HttpAgent, request as httpRequest, RequestOptions as HttpRequestOptions} from 'http';
import {Agent as HttpsAgent, request as httpsRequest} from 'https';
import {connect as tlsConnect, ConnectionOptions as TlsConnectionOptions, TLSSocket} from 'tls';

/**
 * Get an Agent that connects through a proxy.
 * @param {boolean} secure - Will the connection to the destination server be secure? NOT the connection to the proxy.
 * @param {string|null} proxyUrl - The URL of the proxy, including the protocol, auth (if applicable), host, and port
 * @param {int} [proxyTimeout=5000] - Timeout for connecting to the proxy, in milliseconds
 * @returns {HttpAgent|HttpsAgent|boolean}
 */
export default function getProxyAgent(secure: boolean, proxyUrl: string, proxyTimeout = 5000) {
	if (!proxyUrl) {
		return false; // no need to use an agent
	}

	let agent = new (secure ? HttpsAgent : HttpAgent)({keepAlive: false});
	// @ts-ignore
	agent.createConnection = function(options, callback) {
		let url = new URL(proxyUrl);
		let prox:HttpRequestOptions = Object.assign({}, url);

		prox.method = 'CONNECT';
		prox.path = options.host + ':' + options.port; // the host where we want the proxy to connect
		prox.localAddress = options.localAddress;
		if (prox.auth) {
			prox.headers = {
				'Proxy-Authorization': `Basic ${(new Buffer(prox.auth, 'utf8')).toString('base64')}`
			};
			delete prox.auth;
		}

		// Make the CONNECT request
		let finished = false;
		let didWeEverConnect = false;
		let req = (prox.protocol == 'https:' ? httpsRequest : httpRequest)(prox);
		req.end();
		req.setTimeout(proxyTimeout);

		req.on('connect', (res, socket) => {
			didWeEverConnect = true;

			if (finished) {
				// This has already errored
				socket.end();
				return;
			}

			finished = true;
			req.setTimeout(0);

			if (res.statusCode != 200) {
				callback(new Error(`Proxy CONNECT ${res.statusCode} ${res.statusMessage}`));
				return;
			}

			if (!secure) {
				// The connection to the destination server won't be secure, so we're done here
				callback(null, socket);
				return;
			}

			let tlsOptions:TlsConnectionOptions = {socket};
			for (let i in options) {
				if (i.match(/^_/) || ['agent', 'headers'].includes(i)) {
					// Ignore private properties, and "agent" and "headers"
					continue;
				}

				tlsOptions[i] = options[i];
			}

			// The connection to the destination server needs to be secure, so do the TLS handshake with the destination
			let tlsSocket:TLSSocket = tlsConnect(tlsOptions, () => {
				tlsSocket.removeListener('error', onTlsError); // we don't want to intercept errors later on

				if (!tlsSocket.authorized && tlsOptions.rejectUnauthorized !== false) {
					// Checking this isn't strictly necessary as all versions of Node since 2013 won't call this callback in this case
					// (or perhaps all versions of node ever that have TLSSocket?)
					callback(tlsSocket.authorizationError || new Error('Secure connection failed'));
					return;
				}

				// All good!
				callback(null, tlsSocket);
			});

			tlsSocket.on('error', onTlsError);
			function onTlsError(err) {
				// TLS handshake error
				socket.end();
				err.proxyConnecting = !didWeEverConnect;
				callback(err);
			}
		});

		req.on('timeout', () => {
			if (finished) {
				return;
			}

			finished = true;
			let err:any = new Error('Proxy connection timed out');
			err.proxyConnecting = !didWeEverConnect;
			callback(err);
		});

		req.on('error', (err:any) => {
			if (finished) {
				return;
			}

			finished = true;
			err.proxyConnecting = !didWeEverConnect;
			callback(err);
		});
	};

	return agent;
}
