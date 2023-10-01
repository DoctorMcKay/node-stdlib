export default class TTLCache<T> {
	readonly #container: Map<string, {value: T, expire: number}>;
	readonly #ttl: number;

	/**
	 * Construct a new TTLCache.
	 * @param {int} ttlMilliseconds - Default time to live in milliseconds for each entry
	 * @constructor
	 */
	constructor(ttlMilliseconds: number) {
		this.#container = new Map<string, {value: T, expire: number}>();
		this.#ttl = ttlMilliseconds;
	}

	/**
	 * Add an entry to the cache.
	 * @param {string} key - The key under which this entry should be stored
	 * @param {any} value - The value to store in this entry
	 * @param {int} ttlMilliseconds - Optionally set a TTL for this specific entry, rather than using the default global TTL
	 */
	add(key: string, value: T, ttlMilliseconds?: number): void {
		this.#gc();

		let ttl = ttlMilliseconds || this.#ttl;

		this.#container.set(key, {
			value,
			expire: Date.now() + ttl
		});
	}

	/**
	 * Get the entry stored in the cache under a particular key.
	 * @param {string} key - The key to retrieve
	 * @return {null|*} value if present, null if not
	 */
	get(key: string): T|null {
		this.#gc();

		if (!this.#container.has(key)) {
			return null;
		}

		let {value} = this.#container.get(key);
		return value;
	}

	/**
	 * Delete an entry from the cache.
	 * @param {string} key
	 * @returns {void}
	 */
	delete(key: string): void {
		this.#container.delete(key);
		this.#gc();
	}

	/**
	 * Get a list of all keys in the cache.
	 * @returns {string[]}
	 */
	getKeys(): string[] {
		this.#gc();
		return [...this.#container.keys()];
	}

	/**
	 * Clear the cache.
	 * @returns {void}
	 */
	clear(): void {
		this.#container.clear();
	}

	/**
	 * Collect garabge and delete expired entries.
	 * @private
	 */
	#gc(): void {
		let now = Date.now();
		// We cannot use getKeys() since that calls #gc() and would cause recursion
		let keys = [...this.#container.keys()];
		keys.forEach((key) => {
			let {expire} = this.#container.get(key);
			if (expire < now) {
				this.#container.delete(key);
			}
		});
	}
}
