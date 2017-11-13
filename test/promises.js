const callbackPromise = require('../index.js').Promises.callbackPromise;

// non-optional; non-immediate
callbackPromise(['foo', 'bar'], verifyFooBarCallback, doAccept);                                              // callback only
callbackPromise(['foo', 'bar'], null, doAccept).then(verifyFooBarPromise);                                    // promise only
callbackPromise(['foo', 'bar'], verifyFooBarCallback, doAccept).then(verifyFooBarPromise);                    // both
callbackPromise(['foo', 'bar'], null, doAccept);                                                              // neither

callbackPromise(['foo', 'bar'], verifyError, doReject);                                                       // callback only
callbackPromise(['foo', 'bar'], null, doReject).catch(verifyError);                                           // promise only
callbackPromise(['foo', 'bar'], verifyError, doReject).catch(verifyError);                                    // both

// non-optional; immediate
callbackPromise(['foo', 'bar'], verifyFooBarCallback, doAcceptImmediate);                                     // callback only
callbackPromise(['foo', 'bar'], null, doAcceptImmediate).then(verifyFooBarPromise);                           // promise only
callbackPromise(['foo', 'bar'], verifyFooBarCallback, doAcceptImmediate).then(verifyFooBarPromise);           // both
callbackPromise(['foo', 'bar'], null, doAcceptImmediate);                                                     // neither

callbackPromise(['foo', 'bar'], verifyError, doRejectImmediate);                                              // callback only
callbackPromise(['foo', 'bar'], null, doRejectImmediate).catch(verifyError);                                  // promise only
callbackPromise(['foo', 'bar'], verifyError, doRejectImmediate).catch(verifyError);                           // both

// optional; non-immediate
callbackPromise(['foo', 'bar'], verifyFooBarCallback, true, doAccept);                                        // callback only
callbackPromise(['foo', 'bar'], null, true, doAccept).then(verifyFooBarPromise);                              // promise only
callbackPromise(['foo', 'bar'], verifyFooBarCallback, true, doAccept).then(verifyFooBarPromise);              // both
callbackPromise(['foo', 'bar'], null, true, doAccept);                                                        // neither

callbackPromise(['foo', 'bar'], verifyError, true, doReject);                                                 // callback only
callbackPromise(['foo', 'bar'], null, true, doReject).catch(verifyError);                                     // promise only
callbackPromise(['foo', 'bar'], verifyError, true, doReject).catch(verifyError);                              // both
callbackPromise(['foo', 'bar'], null, true, doReject);                                                        // neither

// optional; immediate
callbackPromise(['foo', 'bar'], verifyFooBarCallback, true, doAcceptImmediate);                               // callback only
callbackPromise(['foo', 'bar'], null, true, doAcceptImmediate).then(verifyFooBarPromise);                     // promise only
callbackPromise(['foo', 'bar'], verifyFooBarCallback, true, doAcceptImmediate).then(verifyFooBarPromise);     // both
callbackPromise(['foo', 'bar'], null, true, doAcceptImmediate);                                               // neither

callbackPromise(['foo', 'bar'], verifyError, true, doRejectImmediate);                                        // callback only
callbackPromise(['foo', 'bar'], null, true, doRejectImmediate).catch(verifyError);                            // promise only
callbackPromise(['foo', 'bar'], verifyError, true, doRejectImmediate).catch(verifyError);                     // both
callbackPromise(['foo', 'bar'], null, true, doRejectImmediate);                                               // neither

// object callback
callbackPromise(null, verifyFooBarObjectCallback, doAccept);
callbackPromise(null, verifyFooBarObjectCallback, doAcceptImmediate);

///////
	
function doAccept(accept, reject) {
	setTimeout(() => accept({"bar": "bar", "foo": "foo"}), 500);
}

function doReject(accept, reject) {
	setTimeout(() => reject(new Error("test 1 2 3")), 500);
}

function doAcceptImmediate(accept, reject) {
	accept({"bar": "bar", "foo": "foo"});
}

function doRejectImmediate(accept, reject) {
	reject(new Error("test 1 2 3"));
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
		throw new Error("Got bad argument length " + arguments.length + "; expected 1");
	}
	
	console.log("verifyError passed with message: " + err.message);
}
