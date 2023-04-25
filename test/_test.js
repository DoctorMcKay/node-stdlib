const ChildProcess = require('child_process');
const FS = require('fs');
const Path = require('path');

FS.readdirSync(__dirname).forEach((filename) => {
	if (!filename.match(/^[^_].+\.js$/)) {
		return;
	}

	console.log("===================================");
	console.log("Executing test: " + filename);
	ChildProcess.execFileSync('node', [Path.join(__dirname, filename)], {stdio: 'inherit'});
});

console.log("===================================");
console.log("All tests passed!");
