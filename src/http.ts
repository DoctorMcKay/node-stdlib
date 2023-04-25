import {Http as ModuleType} from './lib/_meta/module-types';

import {HttpClientOptions, HttpRequestOptions, HttpResponse} from './lib/http/client/types';
import HttpClient from './lib/http/client/HttpClient';
import Cookie from './lib/http/client/Cookie';
import CookieJar from './lib/http/client/CookieJar';
import getProxyAgent from './lib/http/proxyagent';

const Http:ModuleType = {
	HttpClient,
	Cookie,
	CookieJar,
	getProxyAgent
};

export {
	HttpClientOptions,
	HttpRequestOptions,
	HttpResponse,
	HttpClient,
	Cookie,
	CookieJar,
	getProxyAgent
};

export default Http;
