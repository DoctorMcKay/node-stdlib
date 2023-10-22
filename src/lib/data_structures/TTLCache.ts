// This import isn't necessary for Node.js, but it is for Electron.
// Ref: https://dev.doctormckay.com/topic/4606-typeerror-setintervalunref-is-not-a-function/
import {setInterval} from 'timers';

export default class TTLCache<T> {
	readonly #container: Map<string, {value: T, expire: number}>;
	readonly #ttl: number;

	/**
	 * Construct a new TTLCache.
	 * @param {int} ttlMilliseconds - Default time to live in milliseconds for each entry
	 * @param {int} [gcIntervalMilliseconds=300000] - Time between garbage collections (default 1 minute)
	 * @constructor
	 */
	constructor(ttlMilliseconds: number, gcIntervalMilliseconds: number = 60000) {
		this.#container = new Map<string, {value: T, expire: number}>();
		this.#ttl = ttlMilliseconds;

		// Force a GC every minute
		setInterval(() => this.#gc(), gcIntervalMilliseconds).unref();
	}

	/**
	 * Add an entry to the cache.
	 * @param {string} key - The key under which this entry should be stored
	 * @param {any} value - The value to store in this entry
	 * @param {int} ttlMilliseconds - Optionally set a TTL for this specific entry, rather than using the default global TTL
	 */
	add(key: string, value: T, ttlMilliseconds?: number): void {
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
		// Collect garbage on just this key if applicable, to ensure that we don't return an expired value
		this.#gcKey(key);

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
		// We cannot use getKeys() since that calls #gc() and would cause recursion
		let keys = [...this.#container.keys()];
		keys.forEach(key => this.#gcKey(key));
	}

	#gcKey(key: string): void {
		let val = this.#container.get(key);
		if (!val) {
			return;
		}

		if (val.expire < Date.now()) {
			this.#container.delete(key);
		}
	}
}
