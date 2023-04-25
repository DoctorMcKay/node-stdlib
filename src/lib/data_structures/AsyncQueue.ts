import Queue from './Queue';

interface QueueWorkItem {
	data: any;
	callback: (err?: Error, ...any) => void;
}

export default class AsyncQueue {
	concurrency: number;
	worker: (workItem: any, callback: (err?: Error, ...any) => void) => void;
	drain?: () => void;
	empty?: () => void;
	start?: (workItem: any) => void;
	error?: (err: Error, workItem: any) => void;

	#running: number;
	#paused: boolean;
	#killed: boolean;
	#queue: Queue;

	/**
	 * Construct a new AsyncQueue. An AsyncQueue is a traditional FIFO queue, but it's designed for asynchronous tasks.
	 * @param {function} worker - A worker function that takes two arguments, (element, callback) to be invoked when processing an item
	 * @param {int} [concurrency=1] - The maximum number of workers that may be working at once
	 * @constructor
	 */
	constructor(worker, concurrency = 1) {
		this.concurrency = concurrency;
		this.worker = worker;
		this.#running = 0;
		this.#paused = false;
		this.#killed = false;
		this.#queue = new Queue();
	}

	get running() {
		return this.#running;
	}

	get paused() {
		return this.#paused;
	}

	get killed() {
		return this.#killed;
	}

	get length() {
		return this.#queue.length;
	}

	/**
	 * Pause execution and stop handing items to workers.
	 */
	pause(): void {
		this.#paused = true;
	}

	/**
	 * Unpause execution and start workers on items in the queue again.
	 */
	resume(): void {
		this.#paused = false;
		this.#process();
	}

	/**
	 * Destroy this queue and stop processing items. Anything currently processing will finish and emit callbacks.
	 */
	kill(): void {
		this.drain = null;
		this.empty = null;

		this.#killed = true;
		this.#queue.empty();
	}

	/**
	 * Push a new item to the end of the queue.
	 * @param {*} item - The item to push into the queue
	 * @param {function} [callback] - A callback to be invoked after this item is finished processing, which takes arguments (err, result)
	 * @return {int} The new length of the queue
	 */
	enqueue(item: any, callback?: (err?: Error, ...any) => void): number {
		if (this.killed) {
			throw new Error('Cannot push items into a killed AsyncQueue');
		}

		let workItem: QueueWorkItem = {data: item, callback};
		this.#queue.push(workItem);
		process.nextTick(() => this.#process());
		return this.length;
	}

	/**
	 * Push a new item to the end of the queue.
	 * @param {*} item - The item to push into the queue
	 * @param {function} [callback] - A callback to be invoked after this item is finished processing, which takes arguments (err, result)
	 * @return {int} The new length of the queue
	 */
	push(item: any, callback?: (err?: Error, ...any) => void): number {
		return this.enqueue(item, callback);
	}

	/**
	 * Insert a new item into the front of the queue.
	 * @param {*} item - The item to push into the queue
	 * @param {function} [callback] - A callback to be invoked after this item is finished processing, which takes arguments (err, result)
	 * @return {int} The new length of the queue
	 */
	insert(item: any, callback?: (err?: Error, ...any) => void) {
		if (this.killed) {
			throw new Error('Cannot insert items into a killed AsyncQueue');
		}

		this.#queue.insert({data: item, callback});
		process.nextTick(() => this.#process());
		return this.length;
	}

	/**
	 * Try to process an item in the queue.
	 * @private
	 */
	#process() {
		if (this.killed || this.paused || this.length == 0 || this.running >= this.concurrency) {
			// execution is killed/paused, there's nothing in the queue, or we already have too many running workers
			return;
		}

		// we don't have too many running workers
		let item: QueueWorkItem = this.#queue.pop();
		if (this.#queue.length == 0 && this.empty) {
			// there is now nothing left in the queue (but we're still processing stuff)
			this.empty();
		}

		this.start && this.start(item);
		this.#running++;
		this.worker(item.data, (err, ...args) => {
			if (err) {
				this.error && this.error(err, item.data);
				item.callback && item.callback.apply(this, [err, ...args]);
			} else {
				item.callback && item.callback.apply(this, [null, ...args]);
			}

			if (--this.#running == 0 && this.length == 0) {
				this.drain && this.drain();
			}

			this.#process();
		});

		this.#process();
	}
}
