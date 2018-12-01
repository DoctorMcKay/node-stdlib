const StdLib = require('../index.js');

stringMustEqual(StdLib.Hashing.md5('the quick brown fox jumps over the lazy dog'), '77add1d5f41223d5582fca736a5cb335');
stringMustEqual(StdLib.Hashing.sha1('the quick brown fox jumps over the lazy dog'), '16312751ef9307c3fd1afbcb993cdc80464ba0f1');
stringMustEqual(StdLib.Hashing.sha256('the quick brown fox jumps over the lazy dog'), '05c6e08f1d9fdafa03147fcb8f82f124c76d2f70e3d989dc8aadb5e7d7450bec');

bufferMustEqual(StdLib.Hashing.md5('the quick brown fox jumps over the lazy dog', 'buffer'), Buffer.from('77add1d5f41223d5582fca736a5cb335', 'hex'));
bufferMustEqual(StdLib.Hashing.sha1('the quick brown fox jumps over the lazy dog', 'buffer'), Buffer.from('16312751ef9307c3fd1afbcb993cdc80464ba0f1', 'hex'));
bufferMustEqual(StdLib.Hashing.sha256('the quick brown fox jumps over the lazy dog', 'buffer'), Buffer.from('05c6e08f1d9fdafa03147fcb8f82f124c76d2f70e3d989dc8aadb5e7d7450bec', 'hex'));

function stringMustEqual(value, target) {
	if (value === target) {
		console.log(`PASS: "${value}" == "${target}"`);
	} else {
		throw new Error(`${value} doesn't match expected ${target}`);
	}
}

function bufferMustEqual(value, target) {
	if (value.equals(target)) {
		console.log(`PASS: Buffer ${value.toString('hex')} == ${target.toString('hex')}`);
	} else {
		throw new Error(`${value.toString('hex')} doesn't match expected ${target.toString('hex')}`);
	}
}
