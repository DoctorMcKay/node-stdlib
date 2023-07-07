const {join} = require('path');

const StdLib = require('../_main');
const {appDataDirectory} = StdLib.OS;

// macOS
process.env.HOME = join('/', 'Users', 'test');
checkValueEqual(
	appDataDirectory({appName: 'stdlib', appAuthor: 'doctormckay', platform: 'darwin'}),
	join('/', 'Users', 'test', 'Library', 'Application Support', 'stdlib')
);

// Windows
process.env.APPDATA = join('C:', 'Users', 'test', 'AppData', 'Roaming');
process.env.LOCALAPPDATA = join('C:', 'Users', 'test', 'AppData', 'Local');
checkValueEqual(
	appDataDirectory({appName: 'stdlib', appAuthor: 'doctormckay', platform: 'win32'}),
	join('C:', 'Users', 'test', 'AppData', 'Local', 'doctormckay', 'stdlib')
);
checkValueEqual(
	appDataDirectory({appName: 'stdlib', appAuthor: 'doctormckay', platform: 'win32', useRoaming: true}),
	join('C:', 'Users', 'test', 'AppData', 'Roaming', 'doctormckay', 'stdlib')
);

// Linux
process.env.HOME = join('/', 'home', 'test');
checkValueEqual(
	appDataDirectory({appName: 'stdlib', appAuthor: 'doctormckay', platform: 'linux'}),
	join('/', 'home', 'test', '.local', 'share', 'stdlib')
);

function checkValueEqual(value, shouldEqual) {
	if (value === shouldEqual) {
		console.log("PASS: " + value + " === " + shouldEqual);
	} else {
		throw new Error(value + " doesn't match expected " + shouldEqual);
	}
}
