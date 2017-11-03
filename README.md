# Standard Library

This is a module intended for my own personal use which contains stuff which I believe the Node.js standard library
*should* have, but doesn't.

It will follow semver, but don't expect me to pay any attention to feature requests (bug reports are welcome though).
As I wrote above, this is really only intended for my own personal use (as with everything in the @doctormckay npm
namespace).

# Data Structures

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

## IPv4

### intToString(ipInt)
- `ipInt` - An integer-format IPv4 address

Returns a dotted-decimal string representation of the input IP address.

### stringToInt(ipString)
- `ipString` - A dotted-decimal string format IPv4 address

Returns a 32-bit unsigned integer representation of the input IP address.
