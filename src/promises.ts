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
	retryPromise,
	timeoutCallbackPromise,
	timeoutPromise,
	callbackPromise,
	sleepAsync
};

export {
	retryPromise,
	timeoutCallbackPromise,
	timeoutPromise,
	callbackPromise,
	sleepAsync
};

export default Promises;
