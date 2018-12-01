const Crypto = require('crypto');

exports.hash = hash;

function hash(hashType, input, outputForm = 'hex') {
	if (!Buffer.isBuffer(input)) {
		input = Buffer.from(input.toString(), 'utf8');
	}

	let hash = Crypto.createHash(hashType);
	hash.update(input);
	return hash.digest(outputForm);
}
