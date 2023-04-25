export default class LeastUsedCache {
	#entries: {[name: string]: any};
	#lastAccess: {[name: string]: number};
	#maxItems: number;
	#gcInterval: number;
	#lastGc: number;

	/**
	 * Construct a new LeastUsedCache.
	 * @param {int} maxItems - Maximum number of items allowed in the cache before stuff will start being pruned
	 * @param {int} gcInterval - Time in milliseconds between garbage collections
	 * @constructor
	 */
	constructor(maxItems: number, gcInterval: number) {
		this.#entries = {};
		this.#lastAccess = {};
		this.#maxItems = maxItems;
		this.#gcInterval = gcInterval;
		this.#lastGc = Date.now();
	}

	/**
	 * Add an entry to the cache.
	 * @param {string} key - The key under which this entry should be stored
	 * @param {*} val - The value to store in this entry
	 */
	add(key: string, val: any): void {
		this.#entries[key] = val;
		this.#lastAccess[key] = Date.now();
		this.checkGC();
	}

	/**
	 * Get the entry stored in the cache under a particular key.
	 * @param {string} key - The key to retrieve
	 * @return {null|*} value if present, null if not
	 */
	get(key: string): any {
		if (typeof this.#entries[key] != 'undefined') {
			this.#lastAccess[key] = Date.now();
			this.checkGC();
			return this.#entries[key];
		} else {
			return null;
		}
	}

	/**
	 * Delete an entry from the cache.
	 * @param {string} key
	 */
	delete(key: string): void {
		delete this.#entries[key];
		delete this.#lastAccess[key];
		this.checkGC();
	}

	/**
	 * Get a list of all keys in the cache.
	 * @returns {string[]}
	 */
	getKeys(): string[] {
		this.checkGC();
		return Object.keys(this.#entries);
	}

	/**
	 * Check if a garbage collection is necessary and if so, do it.
	 */
	checkGC(): void {
		if (Date.now() - this.#lastGc >= this.#gcInterval) {
			this.gc();
		}
	}

	/**
	 * Collect garbage and delete anything over the limit that hasn't been accessed in a while.
	 */
	gc(): void {
		this.#lastGc = Date.now();

		let keys = this.getKeys();
		if (keys.length <= this.#maxItems) {
			return; // we aren't over the limit, so nothing to do
		}

		// sort the keys so that the least-frequently-accessed ones are at the end
		keys.sort((a, b) => this.#lastAccess[a] > this.#lastAccess[b] ? -1 : 1);
		keys.slice(keys.length - (keys.length - this.#maxItems)).forEach((key) => {
			this.delete(key);
		});
	}
}