module.exports = Stack;

/**
 * Create a new Stack. A Stack is a FILO data structure, in which all you can do is append items and remove items from
 * the back. Under the hood, this is implemented with a linked list (LL).
 * @constructor
 */
function Stack() {
	this.length = 0;
	Object.defineProperties(this, {
		"_tail": {
			"enumerable": false,
			"writable": true,
			"value": null
		}
	});
}

/**
 * Push a new item to the top of the stack.
 * @param {*} item - The item to push into the stack
 * @return {int} The new length of the stack
 */
Stack.prototype.push = function(item) {
	// Create the LL node. The "prev" pointer is the existing tail of the list.
	this._tail = {"data": item, "prev": this._tail};
	return ++this.length;
};

/**
 * Remove the top element from the stack and return it.
 * @return {*} The top item in the stack. Null if the stack is empty.
 */
Stack.prototype.pop = function() {
	if (!this._tail) {
		return null;
	}

	let entry = this._tail.data;
	this._tail = this._tail.prev;
	this.length--;
	return entry;
};

/**
 * Empty this stack by removing all items in it.
 */
Stack.prototype.empty = function() {
	this._tail = null;
	this.length = 0;
};
