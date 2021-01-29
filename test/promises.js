const {callbackPromise, timeoutPromise, retryPromise} = require('../index.js').Promises;

// non-optional; non-immediate
callbackPromise(['foo', 'bar'], verifyFooBarCallback, execAccept);                                              // callback only
callbackPromise(['foo', 'bar'], null, execAccept).then(verifyFooBarPromise);                           // promise only
callbackPromise(['foo', 'bar'], verifyFooBarCallback, execAccept).then(verifyFooBarPromise);                    // both
callbackPromise(['foo', 'bar'], null, execAccept);                                                     // neither

callbackPromise(['foo', 'bar'], verifyError, execReject);                                                       // callback only
callbackPromise(['foo', 'bar'], null, execReject).catch(verifyError);                                  // promise only
callbackPromise(['foo', 'bar'], verifyError, execReject).catch(verifyError);                                    // both

// non-optional; immediate
callbackPromise(['foo', 'bar'], verifyFooBarCallback, execAcceptImmediate);                                     // callback only
callbackPromise(['foo', 'bar'], null, execAcceptImmediate).then(verifyFooBarPromise);                  // promise only
callbackPromise(['foo', 'bar'], verifyFooBarCallback, execAcceptImmediate).then(verifyFooBarPromise);           // both
callbackPromise(['foo', 'bar'], null, execAcceptImmediate);                                            // neither

callbackPromise(['foo', 'bar'], verifyError, execRejectImmediate);                                              // callback only
callbackPromise(['foo', 'bar'], null, execRejectImmediate).catch(verifyError);                         // promise only
callbackPromise(['foo', 'bar'], verifyError, execRejectImmediate).catch(verifyError);                           // both

// optional; non-immediate
callbackPromise(['foo', 'bar'], verifyFooBarCallback, true, execAccept);                              // callback only
callbackPromise(['foo', 'bar'], null, true, execAccept).then(verifyFooBarPromise);           // promise only
callbackPromise(['foo', 'bar'], verifyFooBarCallback, true, execAccept).then(verifyFooBarPromise);    // both
callbackPromise(['foo', 'bar'], null, true, execAccept);                                     // neither

callbackPromise(['foo', 'bar'], verifyError, true, execReject);                                       // callback only
callbackPromise(['foo', 'bar'], null, true, execReject).catch(verifyError);                  // promise only
callbackPromise(['foo', 'bar'], verifyError, true, execReject).catch(verifyError);                    // both
callbackPromise(['foo', 'bar'], null, true, execReject);                                     // neither

// optional; immediate
callbackPromise(['foo', 'bar'], verifyFooBarCallback, true, execAcceptImmediate);                     // callback only
callbackPromise(['foo', 'bar'], null, true, execAcceptImmediate).then(verifyFooBarPromise);  // promise only
callbackPromise(['foo', 'bar'], verifyFooBarCallback, true, execAcceptImmediate).then(verifyFooBarPromise);     // both
callbackPromise(['foo', 'bar'], null, true, execAcceptImmediate);                            // neither

callbackPromise(['foo', 'bar'], verifyError, true, execRejectImmediate);                              // callback only
callbackPromise(['foo', 'bar'], null, true, execRejectImmediate).catch(verifyError);         // promise only
callbackPromise(['foo', 'bar'], verifyError, true, execRejectImmediate).catch(verifyError);           // both
callbackPromise(['foo', 'bar'], null, true, execRejectImmediate);                            // neither

// object callback
callbackPromise(null, verifyFooBarObjectCallback, execAccept);
callbackPromise(null, verifyFooBarObjectCallback, execAcceptImmediate);

// timeout promises
timeoutPromise(100, execAccept).then(verifyNotCalled).catch(verifyTimeoutError);
timeoutPromise(5000, execAcceptImmediate).then(verifyFooBarPromise).catch(verifyNotCalled);

timeoutPromise(1000, execThrowError).then(verifyNotCalled).catch(verifyError);
timeoutPromise(1000, execPromiseReject).then(verifyNotCalled).catch(verifyError);

// retry promises
let retryCounter = 0;
retryPromise(5, 100, (resolve, reject) => {
	retryCounter++;
	reject(new Error('retryPromise rejection'));
}).catch((ex) => {
	if (retryCounter !== 5) {
		throw new Error('retryCounter (' + retryCounter + ') !== 5');
	}
	
	if (ex.message !== 'retryPromise rejection') {
		throw new Error('ex.message (\'' + ex.message + '\') !== \'retryPromise rejection\'');
	}
	
	console.log('retryPromise passed');
});

let retryCounter2 = 0;
retryPromise(5, 100, (resolve, reject) => {
	if (++retryCounter2 >= 3) {
		resolve();
	} else {
		reject(new Error('retryPromise rejection 2'));
	}
}).then(() => {
	if (retryCounter2 !== 3) {
		throw new Error('retryCounter2 (' + retryCounter2 + ') !== 3');
	}
	
	console.log('Successful retryPromise passed');
});

///////

function execAccept(accept, reject) {
	setTimeout(() => accept({"bar": "bar", "foo": "foo"}), 500);
}

function execReject(accept, reject) {
	setTimeout(() => reject(new Error("test 1 2 3")), 500);
}

function execAcceptImmediate(accept, reject) {
	accept({"bar": "bar", "foo": "foo"});
}

function execRejectImmediate(accept, reject) {
	reject(new Error("test 1 2 3"));
}

function execThrowError() {
	throw new Error('Error thrown from doThrowError');
}

function execPromiseReject() {
	return new Promise((resolve, reject) => {
		setTimeout(() => reject(new Error('Error from rejecting promise in execAsyncReject')), 500);
	});
}

function verifyFooBarCallback(err, foo, bar) {
	if (arguments.length != 3) {
		throw new Error("Got bad argument count " + arguments.length + "; expected 3");
	}

	if (err !== null) {
		throw new Error("Got bad value " + err + " for err");
	}

	if (foo !== 'foo' || bar !== 'bar') {
		throw new Error("Got bad value for foo " + foo + " or bar " + bar);
	}

	console.log("verifyFooBarCallback passed");
}

function verifyFooBarObjectCallback(err, obj) {
	verifyFooBarPromise(obj);
}

function verifyFooBarPromise(result) {
	if (Object.keys(result).length != 2) {
		throw new Error("Got bad property count " + Object.keys(result).length + "; expected 2");
	}

	if (result.foo !== 'foo' || result.bar !== 'bar') {
		throw new Error("Got bad results for promise");
	}

	console.log("verifyFooBarPromise passed");
}

function verifyError(err) {
	if (!(err instanceof Error)) {
		throw new Error("Got non-Error in verifyError");
	}

	if (arguments.length != 1) {
		throw new Error(`Got bad argument length ${arguments.length}; expected 1`);
	}

	console.log(`verifyError passed with message: ${err.message}`);
}

function verifyTimeoutError(err) {
	verifyError(err);
	if (err.message !== 'Request timed out') {
		throw new Error(`Got bad error message for timeout error: ${err.message}`);
	}
	console.log('verifyTimeoutError passed');
}

function verifyNotCalled() {
	throw new Error('verifyNotCalled() was called');
}
