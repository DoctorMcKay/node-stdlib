const Time = module.exports;

Time.timestampString = function() {
	let date = new Date();
	return date.getFullYear() + '-' +
		padStart(date.getMonth() + 1, 2, '0') + '-' +
		padStart(date.getDate(), 2, '0') + ' ' +
		padStart(date.getHours(), 2, '0') + ':' +
		padStart(date.getMinutes(), 2, '0') + ':' +
		padStart(date.getSeconds(), 2, '0');
};

function padStart(str, length, prefix) {
	if (typeof str !== 'string') {
		str = str.toString();
	}

	if (str.padStart) {
		return str.padStart(length, prefix);
	} else {
		prefix = prefix || ' ';
		while (str.length < length) {
			str = prefix.substring(0, length - str.length) + str;
		}
		return str;
	}
}
