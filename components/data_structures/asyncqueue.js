module.exports = AsyncQueue;

const Queue = require('./queue.js');

/**
 * Construct a new AsyncQueue. An AsyncQueue is a traditional FIFO queue, but it's designed for asynchronous tasks.
 * @param {function} worker - A worker function that takes two arguments, (element, callback) to be invoked when processing an item
 * @param {int} [concurrency=1] - The maximum number of workers that may be working at once
 * @constructor
 */
function AsyncQueue(worker, concurrency) {
	this.concurrency = concurrency || 1;
	this.worker = worker;
	this.running = 0;
	this.paused = false;
	this.length = 0;
	Object.defineProperty(this, "_queue", {"enumerable": false, "writable": false, "value": new Queue()});
}

/**
 * Pause execution and stop handing items to workers.
 */
AsyncQueue.prototype.pause = function() {
	this.paused = true;
};

/**
 * Unpause execution and start workers on items in the queue again.
 */
AsyncQueue.prototype.resume = function() {
	this.paused = false;
	this._process();
};

/**
 * Destroy this queue and stop processing items. Anything currently processing will finish and emit callbacks.
 */
AsyncQueue.prototype.kill = function() {
	delete this.drain;
	delete this.empty;

	Object.defineProperty(this, 'killed', {"enumerable": true, "value": true, "writable": false});
	this._queue.empty();
};

/**
 * Push a new item to the end of the queue.
 * @param {*} item - The item to push into the queue
 * @param {function} callback - A callback to be invoked after this item is finished processing, which takes arguments (err, result)
 * @return {int} The new length of the queue
 */
AsyncQueue.prototype.enqueue = AsyncQueue.prototype.push = function(item, callback) {
	if (this.killed) {
		throw new Error("Cannot push items into a killed AsyncQueue");
	}

	this.length = this._queue.push({"data": item, "callback": callback});
	process.nextTick(this._process.bind(this));
	return this.length;
};

/**
 * Try to process an item in the queue.
 * @private
 */
AsyncQueue.prototype._process = function() {
	if (this.killed || this.paused || this._queue.length == 0 || this.running >= this.concurrency) {
		// execution is killed/paused, there's nothing in the queue, or we already have too many running workers
		return;
	}

	// we don't have too many running workers
	let item = this._queue.pop();
	this.length = this._queue.length;
	if (this._queue.length == 0 && this.empty) {
		// there is now nothing left in the queue (but we're still processing stuff)
		this.empty();
	}

	this.start && this.start(item);
	this.running++;
	let self = this;
	this.worker(item.data, function(err, result) {
		let args = Array.prototype.slice.call(arguments);

		if (err) {
			self.error && self.error(err, item.data);
			item.callback && item.callback.apply(self, args);
		} else {
			args[0] = null;
			item.callback && item.callback.apply(self, args);
		}

		if (--self.running == 0 && self._queue.length == 0) {
			self.drain && self.drain();
		}

		self._process();
	});

	this._process();
};
