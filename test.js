const ChildProcess = require('child_process');
const FS = require('fs');
const Path = require('path');

FS.readdirSync(__dirname + '/test').forEach((filename) => {
	if (!filename.match(/\.js$/)) {
		return;
	}

	console.log("===================================");
	console.log("Executing test: " + filename);
	ChildProcess.execFileSync('node', [Path.join(__dirname, 'test', filename)], {"stdio": "inherit"});
});

console.log("===================================");
console.log("All tests passed!");
