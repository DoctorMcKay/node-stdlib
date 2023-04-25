import {Time as ModuleType} from './lib/_meta/module-types';

function timestampString(): string {
	let date = new Date();
	return date.getFullYear() + '-' +
		padStart(date.getMonth() + 1, 2, '0') + '-' +
		padStart(date.getDate(), 2, '0') + ' ' +
		padStart(date.getHours(), 2, '0') + ':' +
		padStart(date.getMinutes(), 2, '0') + ':' +
		padStart(date.getSeconds(), 2, '0');
}

const Time:ModuleType = {
	timestampString
};

export {
	timestampString
};

export default Time;

function padStart(str: string|number, length: number, prefix = ' '): string {
	if (typeof str !== 'string') {
		str = str.toString();
	}

	if (str.padStart) {
		return str.padStart(length, prefix);
	} else {
		while (str.length < length) {
			str = prefix.substring(0, length - str.length) + str;
		}
		return str;
	}
}
