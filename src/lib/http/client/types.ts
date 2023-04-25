import {Agent as HttpAgent} from 'http';
import {Agent as HttpsAgent} from 'https';
import CookieJar from './CookieJar';

export interface HttpClientOptions {
	httpAgent?: HttpAgent;
	httpsAgent?: HttpsAgent;
	localAddress?: string;
	defaultHeaders?: {[name: string]: string|number};
	cookieJar?: CookieJar|boolean;
	gzip?: boolean;
}

export interface HttpRequestOptions {
	method: string;
	url: string;
	headers?: {[name: string]: string|number};
	body?: string|Buffer;

	urlEncodedForm?: {[name: string]: string|number};
	multipartForm?: {[name: string]: MultipartFormObject};
	json?: {[name: string]: any};

	followRedirects?: boolean;
}

export interface MultipartFormObject {
	contentType: string;
	content: string|Buffer;
}

export interface HttpResponse {
	statusCode: number;
	statusMessage: string;
	url: string; // for detecting destination after a redirect
	headers: {[name: string]: string};
	rawBody: Buffer;
	textBody?: string;
	jsonBody?: object;
}
