const StdLib = require('../index.js');

let cache = new StdLib.DataStructures.LeastUsedCache(5, 1000);
cache.add("one", 1);
cache.add("two", 2);
cache.add("three", 3);
cache.add("four", 4);
cache.add("five", 5);
cache.add("six", 6);
cache.add("seven", 7);

checkCacheKey(cache, "one", 1);
setTimeout(() => {
	checkCacheKey(cache, "two", 2);
	checkCacheKey(cache, "three", 3);
	checkCacheKey(cache, "four", 4);
	checkCacheKey(cache, "five", 5);
	checkCacheKey(cache, "six", 6);
	checkCacheKey(cache, "seven", 7);

	setTimeout(() => {
		cache.get("two");

		setTimeout(() => {
			cache.gc();
			checkCacheKey(cache, "one", null);
			checkCacheKey(cache, "two", 2);

			cache.delete("six");
			checkCacheKey(cache, "six", null);
		}, 50);
	}, 50);
}, 50);

function checkCacheKey(cache, key, expectedValue) {
	let val = cache.get(key);
	if (val === expectedValue) {
		console.log("Cache key \"" + key + "\" value contains " + expectedValue + " as expected");
	} else {
		throw new Error("Cache key \"" + key + "\" value contains " + val + " but we expected " + expectedValue);
	}
}
