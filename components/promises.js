const Promises = module.exports;

/**
 * Return a new promise that will also invoke the callback, if provided.
 * @param {function} executor
 * @param {function} [callback]
 * @param {boolean} [isOptional=false] - If true, then the app won't crash if the user neither provides a callback nor adds a `catch` listener
 * @returns {Promise}
 */
Promises.callbackPromise = function(executor, callback, isOptional) {
	let promise = makePromise(executor);

	if (typeof callback === 'function' || isOptional) {
		promise.then((result) => {
			typeof callback === 'function' ? callback(null, result) : noop();
		}).catch((err) => {
			typeof callback === 'function' ? callback(err) : noop();
		});
	}

	return promise;
};

function makePromise(executor) {
	// this is its own function because reasons
	// okay, those reasons are that it will still crash the app if the only `catch` listener was added in the same
	// function context as when the Promise was instantiated
	return new Promise(executor);
}

function noop() { }
