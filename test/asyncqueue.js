const StdLib = require('../index.js');

let queue = new StdLib.DataStructures.AsyncQueue((item, callback) => {
	setTimeout(() => {
		callback(null, item * 2);
	}, 100);
});

new Array(10).fill(1).forEach((item, idx) => {
	queue.push(idx, (err, result) => {
		if (err) {
			throw err;
		}

		if (result == idx * 2) {
			console.log(idx + ' was processed successfully');
		} else {
			throw new Error(idx + ' was processed wrongly, we expected ' + (idx * 2) + ' but got ' + result);
		}
	});
});

if (queue.length == 10) {
	console.log('AsyncQueue has length 10 as expected');
} else {
	throw new Error('AsyncQueue has length ' + queue.length + '; 10 expected');
}

queue.error = function(err, item) {
	console.log('Error for item ' + item + ': ' + err.message);
	console.log(queue);
};
