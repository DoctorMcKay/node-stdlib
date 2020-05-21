const Promises = module.exports;

/**
 * Return a new promise that will automatically be rejected with 'Error: Request timed out' after a specified timeout period
 * @param {number} timeout - Timeout in milliseconds. If this value is <= 0, then the timeout functionality is disabled.
 * @param {function} executor
 * @returns {Promise}
 */
Promises.timeoutPromise = function(timeout, executor) {
	return new Promise((resolve, reject) => {
		let timedOut = false;
		let timer = null;

		if (timeout > 0) {
			timer = setTimeout(() => {
				timedOut = true;
				reject(new Error('Request timed out'));
			}, timeout);
		}

		executor((resolveValue) => {
			if (!timedOut) {
				clearTimeout(timer);
				resolve(resolveValue);
			}
		}, (rejectValue) => {
			if (!timedOut) {
				clearTimeout(timer);
				reject(rejectValue);
			}
		});
	});
};

/**
 * Return a new promise that will also invoke the callback, if provided.
 * @param {string[]|null} callbackArgs - If null, the entire result object is just passed to the callback as the 2nd arg (1 is err)
 * @param {function|null} callback
 * @param {boolean} [isOptional=false] - If true, then the app won't crash if the user neither provides a callback nor adds a `catch` listener
 * @param {function} executor
 * @returns {Promise}
 */
Promises.callbackPromise = function(callbackArgs, callback, isOptional, executor) {
	return Promises.timeoutCallbackPromise(0, callbackArgs, callback, isOptional, executor);
};

/**
 * Return a new promise that will also invoke the callback, if provided. Also has timeout functionality as in timeoutPromise.
 * @param {number} timeout - Timeout in milliseconds. If this value is <= 0, then the timeout functionality is disabled.
 * @param {string[]|null} callbackArgs - If null, the entire result object is just passed to the callback as the 2nd arg (1 is err)
 * @param {function|null} callback
 * @param {boolean} [isOptional=false] - If true, then the app won't crash if the user neither provides a callback nor adds a `catch` listener
 * @param {function} executor
 * @returns {Promise}
 */
Promises.timeoutCallbackPromise = function(timeout, callbackArgs, callback, isOptional, executor) {
	if (typeof isOptional === 'function') {
		executor = isOptional;
		isOptional = false;
	}

	let promise = Promises.timeoutPromise(timeout, executor);

	if (typeof callback === 'function' || isOptional) {
		promise.then((result) => {
			if (typeof callback === 'function') {
				setImmediate(() => {
					let args = callbackArgs ? callbackArgs.map(argName => typeof result[argName] === 'undefined' ? null : result[argName]) : [result];
					callback(null, ...args);
				});
			}
		}).catch((err) => {
			if (typeof callback === 'function') {
				callback(err);
			}
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
