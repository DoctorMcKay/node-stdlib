module.exports = LeastUsedCache;

/**
 * Construct a new LeastUsedCache.
 * @param {int} maxItems - Maximum number of items allowed in the cache before stuff will start being pruned
 * @param {int} gcInterval - Time in milliseconds between garbage collections
 * @constructor
 */
function LeastUsedCache(maxItems, gcInterval) {
	this._entries = {};
	this._lastAccess = {};
	this._maxItems = maxItems;
	this._gcInterval = gcInterval;
	this._lastGc = Date.now();
}

/**
 * Add an entry to the cache.
 * @param {string} key - The key under which this entry should be stored
 * @param {*} val - The value to store in this entry
 */
LeastUsedCache.prototype.add = function(key, val) {
	this._entries[key] = val;
	this._lastAccess[key] = Date.now();
	this.checkGC();
};

/**
 * Get the entry stored in the cache under a particular key.
 * @param {string} key - The key to retrieve
 * @return {null|*} value if present, null if not
 */
LeastUsedCache.prototype.get = function(key) {
	if (this._entries.hasOwnProperty(key)) {
		this._lastAccess[key] = Date.now();
		this.checkGC();
		return this._entries[key];
	} else {
		return null;
	}
};

/**
 * Delete an entry from the cache.
 * @param {string} key
 */
LeastUsedCache.prototype.delete = function(key) {
	delete this._entries[key];
	delete this._lastAccess[key];
	this.checkGC();
};

/**
 * Get a list of all keys in the cache.
 * @returns {string[]}
 */
LeastUsedCache.prototype.getKeys = function() {
	this.checkGC();
	return Object.keys(this._entries);
};

/**
 * Check if a garbage collection is necessary and if so, do it.
 */
LeastUsedCache.prototype.checkGC = function() {
	if (Date.now() - this._lastGc >= this._gcInterval) {
		this.gc();
	}
};

/**
 * Collect garbage and delete anything over the limit that hasn't been accessed in a while.
 */
LeastUsedCache.prototype.gc = function() {
	this._lastGc = Date.now();

	let keys = this.getKeys();
	if (keys.length <= this._maxItems) {
		return; // we aren't over the limit, so nothing to do
	}

	// sort the keys so that the least-frequently-accessed ones are at the end
	keys.sort((a, b) => this._lastAccess[a] > this._lastAccess[b] ? -1 : 1);
	keys.slice(keys.length - (keys.length - this._maxItems)).forEach((key) => {
		this.delete(key);
	});
};
