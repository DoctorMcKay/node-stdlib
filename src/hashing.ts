import {Hashing as ModuleType} from './lib/_meta/module-types';

import basicHash from './lib/hashing/basic_hash';
import crc32 from './lib/hashing/crc32';

const Hashing:ModuleType = {
	/**
	 * @param {Buffer|string} input
	 * @param {string} [outputForm=hex]
	 */
	md5(input: string|Buffer, outputForm = 'hex') {
		return basicHash('md5', input, outputForm);
	},

	/**
	 * @param {Buffer|string} input
	 * @param {string} [outputForm=hex]
	 */
	sha1(input: string|Buffer, outputForm = 'hex') {
		return basicHash('sha1', input, outputForm);
	},

	/**
	 * @param {Buffer|string} input
	 * @param {string} [outputForm=hex]
	 */
	sha256(input: string|Buffer, outputForm = 'hex') {
		return basicHash('sha256', input, outputForm);
	},

	/**
	 * @param {Buffer} input
	 * @param {string} [outputForm=number]
	 */
	crc32(input: string|Buffer, outputForm = 'number') {
		return crc32(input, outputForm);
	}
};

export default Hashing;
