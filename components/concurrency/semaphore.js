module.exports = Semaphore;

const AsyncQueue = require('../data_structures/asyncqueue.js');

/**
 * Create a new semaphore.
 * @param [concurrency=1]
 * @constructor
 */
function Semaphore(concurrency) {
	Object.defineProperty(this, "_queue", {"enumerable": false, "writable": false, "value": new AsyncQueue(this._next, concurrency || 1)});
}

/**
 * Wait for the semaphore to be available and call the provided function when available.
 * @param {function} item
 */
Semaphore.prototype.wait = function(item) {
	if (typeof item !== 'function') {
		throw new Error("Argument to wait must be of type function; " + typeof item + " given");
	}

	this._queue.push(item);
};

/**
 * @param {function} item
 * @param {function} callback
 * @private
 */
Semaphore.prototype._next = function(item, callback) {
	item(() => callback(null));
};
