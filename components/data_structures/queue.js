module.exports = Queue;

/**
 * Create a new Queue. A Queue is a FIFO data structure, in which all you can do is append items and remove items from
 * the front. Under the hood, this is implemented with a doubly-linked list (DLL).
 * @constructor
 */
function Queue() {
	this.length = 0;
	Object.defineProperties(this, {
		"_head": {
			"enumerable": false,
			"writable": true,
			"value": null
		},
		"_tail": {
			"enumerable": false,
			"writable": true,
			"value": null
		}
	});
}

/**
 * Push a new item to the end of the queue.
 * @param {*} item - The item to push into the queue
 * @return {int} The new length of the queue
 */
Queue.prototype.enqueue = Queue.prototype.push = function(item) {
	// Create the DLL node. The "next" pointer is empty and the "prev" pointer is the existing tail of the list.
	let entry = {"data": item, "next": null, "prev": this._tail};

	if (this._tail) {
		// If we already have a tail, make its next pointer point to this node.
		this._tail.next = entry;
	}

	if (!this._head) {
		// If the list was empty, this is also the new head
		this._head = entry;
	}

	// This node is now our new tail
	this._tail = entry;
	return ++this.length;
};

/**
 * Remove the first element from the queue and return it.
 * @return {*} The first item in the queue. Null if the queue is empty.
 */
Queue.prototype.dequeue = Queue.prototype.pop = function() {
	if (!this._head) {
		return null;
	}

	let entry = this._head.data;
	// remove it from the list
	this._head = this._head.next;
	if (!this._head) {
		// the list is now empty
		this._tail = null;
	}

	this.length--;
	return entry;
};

/**
 * Empty this queue by removing all items in it.
 */
Queue.prototype.empty = function() {
	this._head = null;
	this._tail = null;
	this.length = 0;
};
