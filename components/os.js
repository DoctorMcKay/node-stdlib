const Path = require('path');

const OS = module.exports;

/**
 * Returns path to platform-specific directory where app data can be saved.
 *
 * @param {object} params
 * @param {string} params.appName
 * @param {string} params.appAuthor
 * @param {boolean} [params.useRoaming=false] - Use roaming appdata directory on Windows
 * @param {string} [params.platform] - Override the auto-detected platform
 */
OS.appDataDirectory = function(params) {
	if (!params.appName || !params.appAuthor) {
		throw new Error('appName and appAuthor are required');
	}

	switch (params.platform || process.platform) {
		case 'darwin':
			return Path.join(process.env.HOME, 'Library', 'Application Support', params.appName);

		case 'win32':
			let appDataVar = params.useRoaming ? 'APPDATA' : 'LOCALAPPDATA';
			return Path.join(process.env[appDataVar] || process.env.APPDATA, params.appAuthor, params.appName);

		default:
			if (process.env.XDG_DATA_HOME) {
				return Path.join(process.env.XDG_DATA_HOME, params.appName);
			} else {
				return Path.join(process.env.HOME, '.local', 'share', params.appName);
			}
	}
};
