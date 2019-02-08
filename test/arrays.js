const StdLib = require('../index.js');
const {unique} = StdLib.Arrays;

console.log('Testing Arrays.unique');
checkArrEqual([1, 2, 3], [1, 2, 3]);
checkArrEqual(unique([1, 1, 2, 1, 3, 2, 3, 1, 4]), [1, 2, 3, 4]);
checkArrEqual(unique([1, '1', 1, 2, '2', 1, 3], true), [1, '1', 2, '2', 3]);

function checkArrEqual(arr, shouldEqual) {
	if (arr.toString() == shouldEqual.toString()) {
		console.log("PASS: " + arr.toString() + " == " + shouldEqual.toString());
	} else {
		throw new Error(arr.toString() + " doesn't match expected " + shouldEqual.toString());
	}
}
