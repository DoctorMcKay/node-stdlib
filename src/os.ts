import {join} from 'path';

import {OS as ModuleType} from './lib/_meta/module-types';
import {AppDataDirectoryParams} from './lib/_meta/os';

function appDataDirectory(params: AppDataDirectoryParams): string {
	if (!params.appName || !params.appAuthor) {
		throw new Error('appName and appAuthor are required');
	}

	switch (params.platform || process.platform) {
		case 'darwin':
			return join(process.env.HOME, 'Library', 'Application Support', params.appName);

		case 'win32':
			let appDataVar = params.useRoaming ? 'APPDATA' : 'LOCALAPPDATA';
			return join(process.env[appDataVar] || process.env.APPDATA, params.appAuthor, params.appName);

		default:
			if (process.env.XDG_DATA_HOME) {
				return join(process.env.XDG_DATA_HOME, params.appName);
			} else {
				return join(process.env.HOME, '.local', 'share', params.appName);
			}
	}
}

const OS:ModuleType = {
	appDataDirectory
};

export {
	appDataDirectory
};

export default OS;
