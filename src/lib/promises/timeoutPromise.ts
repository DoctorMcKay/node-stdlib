/**
 * Return a new promise that will automatically be rejected with 'Error: Request timed out' after a specified timeout period
 * @param {number} timeout - Timeout in milliseconds. If this value is <= 0, then the timeout functionality is disabled.
 * @param {function} executor
 * @returns {Promise}
 */
export default function timeoutPromise(
	timeout: number,
	executor: (
		resolve: (value: any) => void,
		reject: (err: any) => void
	) => any
): Promise<any> {
	// We have to create the Error here in order to have a useful stack trace.
	// If we create it inside of the timer callback, we don't get anything helpful.
	let err = new Error('Request timed out');

	return new Promise((resolve, reject) => {
		let timedOut = false;
		let timer = null;

		if (timeout > 0) {
			timer = setTimeout(() => {
				timedOut = true;
				reject(err);
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
}
