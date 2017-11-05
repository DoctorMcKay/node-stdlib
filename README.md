# Standard Library

This is a module intended for my own personal use which contains stuff which I believe the Node.js standard library
*should* have, but doesn't.

It will follow semver, but don't expect me to pay any attention to feature requests (bug reports are welcome though).
As I wrote above, this is really only intended for my own personal use (as with everything in the @doctormckay npm
namespace).

# Table of Contents
- [Data Structures](#data-structures)
    - [AsyncQueue](#asyncqueue)
    - [LeastUsedCache](#leastusedcache)
    - [Stack](#stack)
    - [Queue](#queue)
- [HTTP](#http)
    - [getProxyAgent](#getproxyagentsecure-proxyurl-proxytimeout)
- [IPv4](#ipv4)
    - [intToString](#inttostringipint)
    - [stringToInt](#stringtointipstring)

# Data Structures

## AsyncQueue

```js
const StdLib = require('@doctormckay/stdlib');
let queue = new StdLib.DataStructures.AsyncQueue(processItemSomehow, 2);
```

A Queue that automatically pops the first element from the array and runs the async `worker` on it, up to your set
`concurrency` limit. Very very similar to the `async` module's [Queue](https://caolan.github.io/async/docs.html#queue).

### Constructor(worker[, concurrency])
- `worker` - A function that will be invoked every time an item is popped from the queue. This function should take these arguments:
    - `item` - The item that you pushed into the queue
    - `callback` - A function you should call once processing is finished for the item. The first argument to this callback should be an `Error` if the processing failed, or `null` if it succeeded. Any remaining arguments are passed as-is to the callback passed in the `push` method.

### pause()

Pauses execution. While paused, no new items will be dequeued and passed to a worker, but any workers currently processing
will be allowed to finish.

### resume()

Resumes execution after you paused it. This will begin handing tasks off to workers again.

### kill()

Removes the `drain` and `empty` callbacks and empties the queue. Any workers that are already working will be allowed to
finish. After you kill an AsyncQueue, you cannot use it anymore. Any further attempts to `push` items into the AsyncQueue
will throw an `Error`.

### push(item[, callback])
- `item` - The item to push to the back of the queue
- `callback` - An optional callback to be invoked once processing of this item is complete. The arguments to the callback will be the same as what the worker called back with.

Adds a new item to the queue and if you haven't already reached your concurrency limit, immediately hands it off to a
worker.

### concurrency

A property indicating your concurrency limit. You can assign to this to change the concurrency limit, but it will only
take effect the next time you push an item into the queue or the next time a worker finishes.

### worker

A property containing the worker function that's being used to process items in the queue. You may change it directly if
needed.

### running

A read-only property indicating how many workers are currently running.

### paused

A read-only boolean property indicating if the queue is currently paused.

### length

A read-only property indicating how many items are remaining in the queue, waiting to be assigned to a worker.

### drain

A property you can assign a function to, which will be called whenever the queue is empty and the last worker finishes.

### empty

A property you can assign a function to, which will be called whenever the last item in the queue is handed off to a worker.

### error

A property you can assign a function to, which will be called whenever a worker finishes with an error.
The first argument to the function is the error, and the second is the item that caused it.


## LeastUsedCache

```js
const StdLib = require('@doctormckay/stdlib');
let cache = new StdLib.DataStructures.LeastUsedCache(100, 30000);
```

### Constructor(maxItems, gcInterval)
- `maxItems` - The maximum number of items the LeastUsedCache will store before it starts pruning old stuff
- `gcInterval` - The minimum number of milliseconds between garbage collection attempts

### add(key, val)
- `key` - A string key
- `val` - A value, of any type

Add a new entry to the cache.

### get(key)
- `key` - A string key

Retrieve a value from the cache. Returns `null` if the key doesn't exist.

### delete(key)
- `key` - A string key

Delete a value from the cache.

### getKeys()

Returns an array containing all the keys in the cache.

### checkGC()

Checks if garbage collection is necessary at this point in time, and if it is, does it.

### gc()

Manually collects garbage immediately, without waiting for the proper timeout.


## Queue

```js
const StdLib = require('@doctormckay/stdlib');
let queue = new StdLib.DataStructures.Queue();
```

Just a basic queue, implemented as a doubly-linked list.

### Constructor()

### push(item)
- `item` - The item to push into the back of the queue

Pushes an item into the back of the queue. Returns the queue's new length. Alias: `enqueue(item)`

### pop()

Removes the first item from the queue and returns it. Returns `null` if the queue is empty. Alias: `dequeue()`

### empty()

Removes and discards every item in the queue.

### length

A property indicating how many items are in the queue.


## Stack

```js
const StdLib = require('@doctormckay/stdlib');
let stack = new StdLib.DataStructures.Stack();
```

Just a basic stack, implemented as a linked list.

### Constructor()

### push(item)
- `item` - The item to push onto the top of the stack

Pushes an item onto the top of the stack. Returns the stack's new length.

### pop()

Removes the top item from the stack and returns it. Returns `null` if the stack is empty.

### empty()

Removes and discards every item in the stack.

### length

A property indicating how many items are on the stack.


# HTTP

```js
const StdLib = require('@doctormckay/stdlib');
const HTTP = StdLib.HTTP;
```

### getProxyAgent(secure[, proxyUrl[, proxyTimeout]])
 - `secure` - `true` if this agent will be used for secure (HTTPS) requests, or `false` if not
 - `proxyUrl` - The URL to your proxy, or something falsy to just get `false` returned (indicating no agent)
 - `proxyTimeout` - The timeout for connecting to the proxy in milliseconds; default `5000` (5 seconds)
 
Gets an (HTTP || HTTPS).Agent that can be used to make requests through an HTTP/HTTPS proxy.

```js
const StdLib = require('@doctormckay/stdlib');
const HTTPS = require('https');

HTTPS.get({
  "host": "icanhazip.com",
  "port": 443,
  "agent": StdLib.HTTP.getProxyAgent(true, "http://user:pass@1.2.3.4:12345", 10000)
}, (res) => {
    if (res.statusCode != 200) {
        console.log("HTTP error: " + res.statusCode);
    }
    
    res.on('data', (chunk) => {
        console.log(chunk.toString('utf8'));
    });
}).on('error', (err) => {
    console.log(err);
});
```


# IPv4

```js
const StdLib = require('@doctormckay/stdlib');
const IPv4 = StdLib.IPv4;
```

### intToString(ipInt)
- `ipInt` - An integer-format IPv4 address

Returns a dotted-decimal string representation of the input IP address.

### stringToInt(ipString)
- `ipString` - A dotted-decimal string format IPv4 address

Returns a 32-bit unsigned integer representation of the input IP address.
