const StdLib = require('../index.js');
const {clone, deepEqual} = StdLib.Objects;

console.log('Testing Objects.clone');
let obj1 = {
	"foo": "fooval",
	"subobj": {
		"foo": "fooval",
		"bar": "barval"
	},
	"subarr": [1, 2, 3, 4]
};

let cloned1 = clone(obj1);
cloned1.subobj.bar = 'baz';
cloned1.subarr[1] = 'test';
checkValueEqual(obj1.foo, cloned1.foo);
checkValueEqual(obj1.subobj.bar, 'barval');
checkValueEqual(cloned1.subobj.bar, 'baz');
checkValueEqual(obj1.subarr[1], 2);
checkValueEqual(cloned1.subarr[1], 'test');
checkValueEqual(obj1.subobj.foo, cloned1.subobj.foo);
checkValueEqual(obj1.subarr[2], cloned1.subarr[2]);

console.log('Testing Objects.deepEqual');
checkValueEqual(deepEqual(5, 5, true), true);
checkValueEqual(deepEqual(5, 6, true), false);
checkValueEqual(deepEqual({"bar": "baz", "foo": "bar"}, {"foo": "bar", "bar": "baz"}, true), true);
checkValueEqual(deepEqual([0, 1, 2, 3], [0, 1, 2, 3], true), true);
checkValueEqual(deepEqual({"subobj": obj1}, {"subobj": obj1}, true), true);
checkValueEqual(deepEqual({"subobj": obj1}, {"subobj": cloned1}, true), false);
checkValueEqual(deepEqual({"subarr": [0, 1, obj1, 3]}, {"subarr": [0, 1, obj1, 3]}, true), true);
checkValueEqual(deepEqual({"subarr": [0, 1, obj1, 3]}, {"subarr": [0, 1, cloned1, 3]}, true), false);
checkValueEqual(deepEqual({"obj1": 1}, {"obj2": 1}, true), false);
checkValueEqual(deepEqual({"shared": 1, "obj1": 1}, {"shared": 1, "obj2": 1}, true), false);
checkValueEqual(deepEqual({"shared": 1, "obj1": 1}, {"shared": 1}, true), false);
checkValueEqual(deepEqual({"shared": 1}, {"shared": 1, "obj2": 1}, true), false);
checkValueEqual(deepEqual(obj1, cloned1, true), false);
checkValueEqual(deepEqual(obj1, clone(obj1), true), true);

function checkValueEqual(value, shouldEqual) {
	if (value === shouldEqual) {
		console.log("PASS: " + value + " === " + shouldEqual);
	} else {
		throw new Error(value + " doesn't match expected " + shouldEqual);
	}
}
