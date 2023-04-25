import {Arrays as ModuleType} from './lib/_meta/module-types';

/**
 * Returns an array containing only the unique elements in the input array.
 * @param {Array} array
 * @param {boolean} [strict=false] - Use strict comparisons. If false, performance will be *much* better on large arrays.
 * @returns {Array}
 */
function unique(array: any[], strict = false): any[] {
	let out = [];
	let nonStrictCache = {};
	array.forEach((val) => {
		let inOutputArray = strict || typeof val == 'object' ? out.includes(val) : nonStrictCache[val];
		if (!inOutputArray) {
			out.push(val);
			if (!strict) {
				nonStrictCache[val] = true;
			}
		}
	});

	return out;
}

const Arrays:ModuleType = {
	unique
};

export {
	unique
};

export default Arrays;
