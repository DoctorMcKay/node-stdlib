const Units = module.exports;

/**
 * Return a string containing the human-readable representation of the input byte count.
 * @param {int} bytes
 * @param {boolean} [binary=false] - Pass true to use the binary system instead of the decimal system (i.e. MiB instead of MB)
 * @param {boolean} [forceDecimal=false] - Pass true to always append the tenths decimal place, even if it's 0
 * @return {string}
 */
Units.humanReadableBytes = function(bytes, binary = false, forceDecimal = false) {
	let units = ['K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
	let suffix = binary ? 'iB' : 'B';
	let base = binary ? 1024 : 1000;

	// handle cases where the input is less than any of the multiples
	if (bytes < base) {
		return bytes + ' B';
	}

	for (let i = 0; i < units.length; i++) {
		// this is the unit we want if it's the last, or dividing by the next highest is < 1
		if (i == units.length - 1 || bytes / Math.pow(base, i + 2) < 1) {
			let bytesVal = bytes / Math.pow(base, i + 1);
			return (forceDecimal ? bytesVal.toFixed(1) : (Math.round(bytesVal * 10) / 10)) + ' ' + units[i] + suffix;
		}
	}
};
