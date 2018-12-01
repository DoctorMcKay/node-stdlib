const StdLib = require('../index.js');

valueMustEqual(StdLib.Hashing.md5('the quick brown fox jumps over the lazy dog'), '77add1d5f41223d5582fca736a5cb335');
valueMustEqual(StdLib.Hashing.sha1('the quick brown fox jumps over the lazy dog'), '16312751ef9307c3fd1afbcb993cdc80464ba0f1');
valueMustEqual(StdLib.Hashing.sha256('the quick brown fox jumps over the lazy dog'), '05c6e08f1d9fdafa03147fcb8f82f124c76d2f70e3d989dc8aadb5e7d7450bec');
valueMustEqual(StdLib.Hashing.crc32(Buffer.from('the quick brown fox jumps over the lazy dog', 'ascii')), 3456913684);
valueMustEqual(StdLib.Hashing.crc32(Buffer.from('the quick brown fox jumps over the lazy dog', 'ascii'), 'hex'), 'ce0c5114');

bufferMustEqual(StdLib.Hashing.md5('the quick brown fox jumps over the lazy dog', 'buffer'), Buffer.from('77add1d5f41223d5582fca736a5cb335', 'hex'));
bufferMustEqual(StdLib.Hashing.sha1('the quick brown fox jumps over the lazy dog', 'buffer'), Buffer.from('16312751ef9307c3fd1afbcb993cdc80464ba0f1', 'hex'));
bufferMustEqual(StdLib.Hashing.sha256('the quick brown fox jumps over the lazy dog', 'buffer'), Buffer.from('05c6e08f1d9fdafa03147fcb8f82f124c76d2f70e3d989dc8aadb5e7d7450bec', 'hex'));
bufferMustEqual(StdLib.Hashing.crc32(Buffer.from('the quick brown fox jumps over the lazy dog', 'ascii'), 'buffer'), Buffer.from('ce0c5114', 'hex'));

function valueMustEqual(value, target) {
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
