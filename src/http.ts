import {Http as ModuleType} from './lib/_meta/module-types';

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
	HttpClient,
	Cookie,
	CookieJar,
	getProxyAgent
};

export default Http;
