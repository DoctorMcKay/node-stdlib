import {Promises as ModuleType} from './lib/_meta/module-types';

import retryPromise from './lib/promises/retryPromise';
import timeoutCallbackPromise from './lib/promises/timeoutCallbackPromise';
import timeoutPromise from './lib/promises/timeoutPromise';

function callbackPromise(
	callbackArgs: string[],
	callback: null|((...args) => void),
	isOptional: boolean,
	executor: (
	resolve: (value: any) => void,
	reject: (err: any) => void
) => void
): Promise<any> {
	return timeoutCallbackPromise(0, callbackArgs, callback, isOptional, executor);
}

/**
 * A "better promise" is just a promise that behaves normally, except if the executor is an async function which rejects,
 * that bubbles up to reject this promise too.
 * @param {function} executor
 */
function betterPromise(
	executor: (resolve: (value: any) => void, reject: (value: any) => void) => void
): Promise<any> {
	return timeoutPromise(0, executor);
}

/**
 * Resolves the promise after some specific delay.
 * @param {int} sleepMilliseconds
 * @returns {Promise}
 */
function sleepAsync(sleepMilliseconds: number): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(resolve, sleepMilliseconds);
	});
}

const Promises:ModuleType = {
	betterPromise,
	retryPromise,
	timeoutCallbackPromise,
	timeoutPromise,
	callbackPromise,
	sleepAsync
};

export {
	betterPromise,
	retryPromise,
	timeoutCallbackPromise,
	timeoutPromise,
	callbackPromise,
	sleepAsync
};

export default Promises;
