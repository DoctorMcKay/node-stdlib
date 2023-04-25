const FS = require('fs');
const Path = require('path');

const MODULE_ROOT = Path.join(__dirname, '..');

FS.readdirSync(MODULE_ROOT).forEach((filename) => {
	if (!filename.startsWith('.') && endsWith(filename, ['.js', '.ts', '.map'])) {
		FS.unlinkSync(Path.join(MODULE_ROOT, filename));
	}
});

deleteDirectory(Path.join(MODULE_ROOT, 'lib'));

function deleteDirectory(dirName) {
	if (!FS.existsSync(dirName)) {
		return;
	}

	FS.readdirSync(dirName).forEach((filename) => {
		let filePath = Path.join(dirName, filename);

		let stat = FS.statSync(filePath);
		if (stat.isDirectory()) {
			deleteDirectory(filePath);
		} else {
			FS.unlinkSync(filePath);
		}
	});

	FS.rmdirSync(dirName);
}

function endsWith(haystack, needles) {
	return (needles || []).some(needle => haystack.endsWith(needle));
}
