import {Agent as HttpAgent, IncomingHttpHeaders} from 'http';
import {Agent as HttpsAgent} from 'https';
import CookieJar from './CookieJar';

export interface HttpClientOptions {
	httpAgent?: HttpAgent;
	httpsAgent?: HttpsAgent;
	localAddress?: string;
	defaultHeaders?: {[name: string]: string|number};
	defaultTimeout?: number;
	cookieJar?: CookieJar|boolean;
	gzip?: boolean;
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
	statusCode: number;
	statusMessage: string;
	url: string; // for detecting destination after a redirect
	headers: IncomingHttpHeaders;
	rawBody: Buffer;
	textBody?: string;
	jsonBody?: {[name: string]: any};
}
