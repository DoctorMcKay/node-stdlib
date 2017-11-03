const StdLib = require('../index.js');

let stack = new StdLib.DataStructures.Stack();
checkStackLength(stack, 0);

stack.push("first");
stack.push("second");
checkStackLength(stack, 2);
checkStackPop(stack, "second");
checkStackLength(stack, 1);
checkStackPop(stack, "first");
console.log("All tests passed");

function checkStackLength(stack, length) {
	if (stack.length === length) {
		console.log("Stack length is expectedly " + length);
	} else {
		throw new Error("Stack length should be " + length + ", but is " + stack.length);
	}
}

function checkStackPop(stack, expectedValue) {
	let entry = stack.pop();
	if (entry === expectedValue) {
		console.log("Popped expected value " + expectedValue + " from stack");
	} else {
		throw new Error("Expected value " + expectedValue + " from stack, but popped " + entry);
	}
}
