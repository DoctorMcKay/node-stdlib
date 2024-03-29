const StdLib = require('../_main.js');

let queue = new StdLib.DataStructures.Queue();
checkQueueLength(queue, 0);

queue.push('second');
queue.enqueue('third');
queue.insert('first');
checkQueueLength(queue, 3);
checkQueuePop(queue, 'first');
checkQueueLength(queue, 2);
checkQueuePop(queue, 'second');
checkQueueLength(queue, 1);
checkQueuePop(queue, 'third');
checkQueueLength(queue, 0);
console.log("All tests passed");

function checkQueueLength(queue, length) {
	if (queue.length === length) {
		console.log("Queue length is expectedly " + length);
	} else {
		throw new Error("Queue length should be " + length + ", but is " + queue.length);
	}
}

function checkQueuePop(queue, expectedValue) {
	let entry = queue.pop();
	if (entry === expectedValue) {
		console.log("Popped expected value " + expectedValue + " from queue");
	} else {
		throw new Error("Expected value " + expectedValue + " from queue, but popped " + entry);
	}
}
