import {Objects as ModuleType} from './lib/_meta/module-types';

const Objects:ModuleType = {
	/**
	 * Clone an object/array/any other type.
	 * @param {*} obj
	 * @returns {*}
	 */
	clone(obj: any): any {
		if (typeof obj != 'object' || obj === null) {
			return obj;
		}

		let outObj = Array.isArray(obj) ? obj.slice(0) : {};
		for (let i in obj) {
			outObj[i] = Objects.clone(obj[i]);
		}

		return outObj;
	},

	/**
	 * Check whether two objects or values and all their subobjects are equal (same keys with same values, but not necessarily in the same order (except for arrays))
	 * @param {*} obj1
	 * @param {*} obj2
	 * @param {boolean} [strict=false] - Use strict equality checks?
	 * @returns {boolean}
	 */
	deepEqual(obj1: any, obj2: any, strict = false): boolean {
		if (typeof obj1 != 'object') {
			return checkEq(obj1, obj2);
		}

		if (obj1 === null) {
			return obj1 === obj2;
		}

		// Catch cases where obj2 has extra keys
		if (Object.keys(obj1).length !== Object.keys(obj2).length) {
			return false;
		}

		for (let i in obj1) {
			if (!Objects.deepEqual(obj1[i], obj2[i], strict)) {
				return false;
			}
		}

		return true;

		function checkEq(val1, val2) {
			return strict ? val1 === val2 : val1 == val2;
		}
	}
};

export default Objects;
