const {join} = require('path');

const StdLib = require('../index.js');
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

// macOS without HOME
delete process.env.HOME;
checkValueEqual(
	appDataDirectory({appName: 'stdlib', appAuthor: 'doctormckay', platform: 'darwin'}),
	null
);

// Windows without APPDATA
delete process.env.APPDATA;
delete process.env.LOCALAPPDATA;

checkValueEqual(
	appDataDirectory({appName: 'stdlib', appAuthor: 'doctormckay', platform: 'win32', useRoaming: false}),
	null
);
checkValueEqual(
	appDataDirectory({appName: 'stdlib', appAuthor: 'doctormckay', platform: 'win32', useRoaming: true}),
	null
);

// Linux without HOME
delete process.env.HOME;
delete process.env.XDG_DATA_HOME;
checkValueEqual(
	appDataDirectory({appName: 'stdlib', appAuthor: 'doctormckay', platform: 'linux'}),
	null
);

function checkValueEqual(value, shouldEqual) {
	if (value === shouldEqual) {
		console.log("PASS: " + value + " === " + shouldEqual);
	} else {
		throw new Error(value + " doesn't match expected " + shouldEqual);
	}
}
