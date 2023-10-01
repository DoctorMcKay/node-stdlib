const StdLib = require('../_main.js');

main();
async function main() {
	let cache = new StdLib.DataStructures.TTLCache(500);

	cache.add('one', 1);
	cache.add('two', 2, 1000);

	checkCacheKey(cache, 'one', 1);
	checkCacheKey(cache, 'two', 2);

	await StdLib.Promises.sleepAsync(600);

	checkCacheKey(cache, 'one', null);
	checkCacheKey(cache, 'two', 2);

	await StdLib.Promises.sleepAsync(500);

	checkCacheKey(cache, 'one', null);
	checkCacheKey(cache, 'two', null);
}

function checkCacheKey(cache, key, expectedValue) {
	let val = cache.get(key);
	if (val === expectedValue) {
		console.log("Cache key \"" + key + "\" value contains " + expectedValue + " as expected");
	} else {
		throw new Error("Cache key \"" + key + "\" value contains " + val + " but we expected " + expectedValue);
	}
}
