const Arrays = module.exports;

/**
 * Returns an array containing only the unique elements in the input array.
 * @param {Array} array
 * @param {boolean} [strict=false] - Use strict comparisons. If false, performance will be *much* better on large arrays.
 * @returns {Array}
 */
Arrays.unique = function(array, strict) {
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
};
