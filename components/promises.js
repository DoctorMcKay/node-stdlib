const Promises = module.exports;

/**
 * Return a new promise that will also invoke the callback, if provided.
 * @param {string[]|null} callbackArgs - If null, the entire result object is just passed to the callback as the 2nd arg (1 is err)
 * @param {function|null} callback
 * @param {boolean} [isOptional=false] - If true, then the app won't crash if the user neither provides a callback nor adds a `catch` listener
 * @param {function} executor
 * @returns {Promise}
 */
Promises.callbackPromise = function(callbackArgs, callback, isOptional, executor) {
	if (typeof isOptional === 'function') {
		executor = isOptional;
		isOptional = false;
	}

	let promise = makePromise(executor);

	if (typeof callback === 'function' || isOptional) {
		promise.then((result) => {
			if (typeof callback === 'function') {
				setImmediate(() => {
					let args = callbackArgs ? callbackArgs.map(argName => typeof result[argName] === 'undefined' ? null : result[argName]) : [result];
					callback(null, ...args);
				});
			}
		}).catch((err) => {
			typeof callback === 'function' ? callback(err) : noop();
		});
	}

	return promise;
};

/**
 * Resolves the promise after some specific delay.
 * @param {int} sleepMilliseconds
 * @returns {Promise}
 */
Promises.sleepAsync = function(sleepMilliseconds) {
	return new Promise((accept) => {
		setTimeout(accept, sleepMilliseconds);
	});
};

function makePromise(executor) {
	// this is its own function because reasons
	// okay, those reasons are that it will still crash the app if the only `catch` listener was added in the same
	// function context as when the Promise was instantiated
	return new Promise(executor);
}

function noop() { }
