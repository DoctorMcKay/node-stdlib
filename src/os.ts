import {join} from 'path';

import {OS as ModuleType} from './lib/_meta/module-types';
import {AppDataDirectoryParams} from './lib/_meta/os';

function appDataDirectory(params: AppDataDirectoryParams): string {
	if (!params.appName || !params.appAuthor) {
		throw new Error('appName and appAuthor are required');
	}

	switch (params.platform || process.platform) {
		case 'darwin':
			if (process.env.HOME) {
				return join(process.env.HOME, 'Library', 'Application Support', params.appName);
			}

			// No HOME env var
			return null;

		case 'win32':
			let appDataVar = params.useRoaming ? 'APPDATA' : 'LOCALAPPDATA';
			let basePath = process.env[appDataVar] || process.env.APPDATA;
			if (basePath) {
				return join(basePath, params.appAuthor, params.appName);
			}

			// No APPDATA or LOCALAPPDATA env var
			return null;

		default:
			if (process.env.XDG_DATA_HOME) {
				return join(process.env.XDG_DATA_HOME, params.appName);
			} else if (process.env.HOME) {
				return join(process.env.HOME, '.local', 'share', params.appName);
			} else {
				// No XDG_DATA_HOME or HOME env var
				return null;
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
