import {Agent as HttpAgent, IncomingHttpHeaders} from 'http';
import {Agent as HttpsAgent} from 'https';
import CookieJar from './CookieJar';

export interface HttpClientOptions {
	userAgent?: string;
	httpAgent?: HttpAgent;
	httpsAgent?: HttpsAgent;
	localAddress?: string;
	defaultHeaders?: {[name: string]: string|number};
	defaultTimeout?: number;
	cookieJar?: CookieJar|boolean;
	gzip?: boolean;
	http2?: boolean;
}

export interface HttpRequestOptions {
	method: string;
	url: string;
	queryString?: {[name: string]: any};
	headers?: {[name: string]: any};

	body?: string|Buffer;

	urlEncodedForm?: {[name: string]: any};
	multipartForm?: {[name: string]: MultipartFormObject};
	json?: {[name: string]: any};

	followRedirects?: boolean;
	timeout?: number;
}

export interface MultipartFormObject {
	contentType?: string;
	filename?: string;
	content: string|Buffer;
}

export interface HttpResponse {
	httpVersion?: string;
	statusCode: number;
	statusMessage: string;
	url: string; // for detecting destination after a redirect
	headers: IncomingHttpHeaders;
	rawBody: Buffer;
	textBody?: string;
	jsonBody?: {[name: string]: any};
}
