import {IPv4 as ModuleType} from './lib/_meta/module-types';

/**
 * Convert an integer IPv4 address into dotted-decimal string format.
 * @param {int} ipInt
 * @returns {string}
 */
function intToString(ipInt: number): string {
	let buf = Buffer.alloc(4);
	buf.writeUInt32BE(ipInt >>> 0, 0);
	return Array.prototype.join.call(buf, '.');
}

/**
 * Convert a dotted-decimal string IPv4 address to integer format.
 * @param {string} ipString
 * @returns {int}
 */
function stringToInt(ipString: string): number {
	let buf = Buffer.alloc(4);
	let octets = ipString.split('.');
	for (let i = 0; i < 4; i++) {
		buf[i] = parseInt(octets[i], 10);
	}
	return buf.readUInt32BE(0);
}

const IPv4:ModuleType = {
	intToString,
	stringToInt
};

export {
	intToString,
	stringToInt
};

export default IPv4;
