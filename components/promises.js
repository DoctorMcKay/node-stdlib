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

		try {
			let executorReturn = executor((resolveValue) => {
				// resolve() was called inside the executor
				if (!timedOut) {
					clearTimeout(timer);
					resolve(resolveValue);
				}
			}, (rejectValue) => {
				// reject() was called inside the executor
				if (!timedOut) {
					clearTimeout(timer);
					reject(rejectValue);
				}
			});

			if (typeof executorReturn == 'object' && executorReturn !== null && typeof executorReturn.catch == 'function') {
				// It's an async function
				executorReturn.catch((ex) => {
					// The executor is an async function and it was rejected (e.g. new Promise(async (resolve, reject) => { }))
					if (!timedOut) {
						clearTimeout(timer);
						reject(ex);
					}
				});
			}
		} catch (ex) {
			if (!timedOut) {
				// The executor is not an async function, and something threw inside of it
				clearTimeout(timer);
				reject(ex);
			}
		}
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
 * Returns a promise that will call the executor again on error, up to the specified number of attempts.
 * @param {int} attempts
 * @param {int} [delayBetweenAttempts] - Delay in milliseconds between executor failure and subsequent re-attempt
 * @param {function} executor
 * @returns {Promise}
 */
Promises.retryPromise = function(attempts, delayBetweenAttempts, executor) {
	if (typeof delayBetweenAttempts == 'function') {
		executor = delayBetweenAttempts;
		delayBetweenAttempts = 0;
	}
	
	return new Promise((resolve, reject) => {
		try {
			let executorReturn = executor((resolveValue) => {
				// resolve() was called inside the executor
				resolve(resolveValue);
			}, handleRejection);
			
			if (typeof executorReturn == 'object' && executorReturn !== null && typeof executorReturn.catch == 'function') {
				// It's an async function
				// The executor is an async function and it was rejected (e.g. new Promise(async (resolve, reject) => { }))
				executorReturn.catch(handleRejection);
			}
		} catch (ex) {
			// The executor is not an async function, and something threw inside of it
			handleRejection(ex);
		}
		
		function handleRejection(value) {
			console.log('handling rejection');
			if (attempts <= 1) {
				return reject(value); // fatal failure
			}
			
			setTimeout(() => {
				let innerPromise = Promises.retryPromise(attempts - 1, delayBetweenAttempts, executor);
				innerPromise.then(resolve, reject);
			}, delayBetweenAttempts);
		}
	});
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
