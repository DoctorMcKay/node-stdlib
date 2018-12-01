const Hashing = module.exports;

const BasicHash = require('./hashing/basic_hash.js');

/**
 * @param {Buffer|string} input
 * @param {string} [outputForm=hex]
 */
Hashing.md5 = (input, outputForm = 'hex') => BasicHash.hash('md5', input, outputForm);

/**
 * @param {Buffer|string} input
 * @param {string} [outputForm=hex]
 */
Hashing.sha1 = (input, outputForm = 'hex') => BasicHash.hash('sha1', input, outputForm);

/**
 * @param {Buffer|string} input
 * @param {string} [outputForm=hex]
 */
Hashing.sha256 = (input, outputForm = 'hex') => BasicHash.hash('sha256', input, outputForm);
