import AsyncQueue from '../data_structures/AsyncQueue';

export default class Semaphore {
	#queue: AsyncQueue;

	/**
	 * Create a new semaphore.
	 * @param [concurrency=1]
	 * @constructor
	 */
	constructor(concurrency = 1) {
		this.#queue = new AsyncQueue((item, callback) => this.#next(item, callback), concurrency);
	}

	get free() {
		return this.isFree();
	}

	/**
	 * Wait for the semaphore to be available and call the provided function when available.
	 * @param {function} callback
	 */
	wait(callback: (release: () => void) => void): void {
		if (typeof callback !== 'function') {
			throw new Error(`Argument to wait must be of type function; ${typeof callback} given`);
		}

		this.#queue.push(callback);
	}

	/**
	 * Wait for the semaphore to be available and resolve the returned function when available.
	 * The result of the resolved promise is a release() function that you must call when you're done with your work and
	 * are ready to release the semaphore.
	 * @return Promise<function>
	 */
	waitAsync(): Promise<() => void> {
		return new Promise(resolve => this.wait(resolve));
	}

	/**
	 * Returns whether the semaphore is currently free. A semaphore is free if a call to wait() would result in immediate
	 * invocation.
	 * @return {boolean}
	 */
	isFree(): boolean {
		return this.#queue.running < this.#queue.concurrency && this.#queue.length == 0;
	}

	/**
	 * @param {function} item
	 * @param {function} callback
	 * @private
	 */
	#next(item: (release: () => void) => void, callback: (err?: Error) => void) {
		item(() => callback(null));
	}
}
