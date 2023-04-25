import {createHash} from 'crypto';

export default function hash(hashType: string, input: Buffer|string, outputForm = 'hex'): string|Buffer {
	if (!Buffer.isBuffer(input)) {
		input = Buffer.from(input.toString(), 'utf8');
	}

	let hash = createHash(hashType);
	hash.update(input);
	let digest = hash.digest();
	return outputForm == 'buffer' ? digest : digest.toString(outputForm);
}
