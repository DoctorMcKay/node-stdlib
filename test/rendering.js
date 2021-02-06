const {Rendering} = require('../index.js');

valueMustEqual(Rendering.progressBar(99, 100, 41, true), '[================= 99% ================>]');
valueMustEqual(Rendering.progressBar(99, 100, 41), '[======================================>]');
valueMustEqual(Rendering.progressBar(57, 100, 21, true), '[======= 57%        ]');

function valueMustEqual(value, target) {
	if (value === target) {
		console.log(`PASS: "${value}" == "${target}"`);
	} else {
		throw new Error(`${value} doesn't match expected ${target}`);
	}
}
