export default class TTLCache {
	private readonly container = new Map<string, any>();
	private readonly timeouts = new Map<string, any>();

	/**
	 * Construct a new TTLCache.
	 * @param {int} ttl Time to live in milliseconds for each entry
	 * @constructor
	 */
	constructor(private readonly ttl?: number) {}

	/**
	 * Add an entry to the cache.
	 * @param {string} key - The key under which this entry should be stored
	 * @param {*} val - The value to store in this entry
	 */
	add<V>(key: string, val: V, ttl?: number): void {
		this.container.set(key, val);

		ttl = ttl || this.ttl;
		if (ttl) this.timeouts.set(key, setTimeout(() => this.delete(key), ttl).unref());
	}

	/**
	 * Get the entry stored in the cache under a particular key.
	 * @param {string} key - The key to retrieve
	 * @return {null|*} value if present, null if not
	 */
	get<V>(key: string): V | null {
		const value = this.container.get(key);
		return typeof value !== 'undefined' ? value : null;
	}

	/**
	 * Delete an entry from the cache.
	 * @param {string} key
	 * @returns {void}
	 */
	delete(key: string): void {
		this.container.delete(key);

		if (this.timeouts.has(key)) {
			clearTimeout(this.timeouts.get(key));
			this.timeouts.delete(key);
		}
	}

	/**
	 * Get a list of all keys in the cache.
	 * @returns {string[]}
	 */
	getKeys(): string[] {
		return [...this.container.keys()];
	}

	/**
	 * Clear the cache.
	 * @returns {void}
	 */
	clear(): void {
		this.container.clear();
		this.timeouts.forEach((timeout) => clearTimeout(timeout));
	}
}
