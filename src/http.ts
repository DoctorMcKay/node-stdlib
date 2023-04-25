import {Http as ModuleType} from './lib/_meta/module-types';

import HttpClient from './lib/http/client/HttpClient';
import getProxyAgent from './lib/http/proxyagent';

const Http:ModuleType = {
	HttpClient,
	getProxyAgent
};

export {
	HttpClient,
	getProxyAgent
};

export default Http;
