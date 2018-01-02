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
 * Returns whether the semaphore is currently free. A semaphore is free if a call to wait() would result in immediate
 * invocation.
 * @return {boolean}
 */
Semaphore.prototype.isFree = function() {
	return this._queue.running < this._queue.concurrency && this._queue.length == 0;
};

/**
 * @param {function} item
 * @param {function} callback
 * @private
 */
Semaphore.prototype._next = function(item, callback) {
	item(() => callback(null));
};
