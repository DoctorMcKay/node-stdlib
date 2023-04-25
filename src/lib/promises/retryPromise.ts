/**
 * Returns a promise that will call the executor again on error, up to the specified number of attempts.
 * @param {int} attempts
 * @param {int} [delayBetweenAttempts] - Delay in milliseconds between executor failure and subsequent re-attempt
 * @param {function} executor
 * @returns {Promise}
 */
export default function retryPromise(
	attempts: number,
	delayBetweenAttempts: number,
	executor: (
		resolve: (value: any) => void,
		reject: (err: any) => void
	) => any
): Promise<any> {
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
				let innerPromise = retryPromise(attempts - 1, delayBetweenAttempts, executor);
				innerPromise.then(resolve, reject);
			}, delayBetweenAttempts);
		}
	});
}
