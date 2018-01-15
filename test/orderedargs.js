const StdLib = require('../index.js');
const orderedArgs = StdLib.Parsing.orderedArgs;

checkArrEqual(orderedArgs('one two three four'), ['one', 'two', 'three', 'four']);
checkArrEqual(orderedArgs('one two "three three" four "five five" six'), ['one', 'two', 'three three', 'four', 'five five', 'six']);
checkArrEqual(orderedArgs('one two\\ two three "four" five'), ['one', 'two two', 'three', 'four', 'five']);
checkArrEqual(orderedArgs('one two "" four five'), ['one', 'two', '', 'four', 'five']);
checkArrEqual(orderedArgs('one two "three three\\" three" four'), ['one', 'two', 'three three" three', 'four']);
checkArrEqual(orderedArgs('one two \\\\ three four'), ['one', 'two', '\\', 'three', 'four']);


function checkArrEqual(arr, shouldEqual) {
	if (arr.toString() == shouldEqual.toString()) {
		console.log("PASS: " + arr.toString() + " == " + shouldEqual.toString());
	} else {
		throw new Error(arr.toString() + " doesn't match expected " + shouldEqual.toString());
	}
}
