const IPv4 = module.exports;

/**
 * Convert an integer IPv4 address into dotted-decimal string format.
 * @param {int} ipInt
 * @returns {string}
 */
IPv4.intToString = function(ipInt) {
	let buf = Buffer.alloc(4);
	buf.writeUInt32BE(ipInt >>> 0, 0);
	return Array.prototype.join.call(buf, '.');
};

/**
 * Convert a dotted-decimal string IPv4 address to integer format.
 * @param {string} ipString
 * @reutrns {int}
 */
IPv4.stringToInt = function(ipString) {
	let buf = Buffer.alloc(4);
	let octets = ipString.split('.');
	for (let i = 0; i < 4; i++) {
		buf[i] = parseInt(octets[i], 10);
	}
	return buf.readUInt32BE(0);
};
