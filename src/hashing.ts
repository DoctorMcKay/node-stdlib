import {Hashing as ModuleType} from './lib/_meta/module-types';

import basicHash from './lib/hashing/basic_hash';
import crc32 from './lib/hashing/crc32';

/**
 * @param {Buffer|string} input
 * @param {string} [outputForm=hex]
 */
function md5(input: string|Buffer, outputForm = 'hex') {
	return basicHash('md5', input, outputForm);
}

/**
 * @param {Buffer|string} input
 * @param {string} [outputForm=hex]
 */
function sha1(input: string|Buffer, outputForm = 'hex') {
	return basicHash('sha1', input, outputForm);
}

/**
 * @param {Buffer|string} input
 * @param {string} [outputForm=hex]
 */
function sha256(input: string|Buffer, outputForm = 'hex') {
	return basicHash('sha256', input, outputForm);
}

const Hashing:ModuleType = {
	md5,
	sha1,
	sha256,
	crc32
};

export {
	md5,
	sha1,
	sha256,
	crc32
};

export default Hashing;
