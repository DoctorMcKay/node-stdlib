import {IPv4 as ModuleType} from './lib/_meta/module-types';

const IPv4:ModuleType = {
	/**
	 * Convert an integer IPv4 address into dotted-decimal string format.
	 * @param {int} ipInt
	 * @returns {string}
	 */
	intToString(ipInt: number): string {
		let buf = Buffer.alloc(4);
		buf.writeUInt32BE(ipInt >>> 0, 0);
		return Array.prototype.join.call(buf, '.');
	},

	/**
	 * Convert a dotted-decimal string IPv4 address to integer format.
	 * @param {string} ipString
	 * @returns {int}
	 */
	stringToInt(ipString: string): number {
		let buf = Buffer.alloc(4);
		let octets = ipString.split('.');
		for (let i = 0; i < 4; i++) {
			buf[i] = parseInt(octets[i], 10);
		}
		return buf.readUInt32BE(0);
	}
};

export default IPv4;
