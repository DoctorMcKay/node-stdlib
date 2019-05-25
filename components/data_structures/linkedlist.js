module.exports = LinkedList;

function LinkedList() {
	this.length = 0;

	this._head = null;
	this._tail = null;
}

// Untested implementation; for future use
/*LinkedList.prototype.concat = function(otherList) {
	let output = new LinkedList();
	output._head = this._head;
	output._tail = otherList._tail;

	let tail = cloneNode(this._tail);
	let head = cloneNode(otherList._head);
	if (tail) {
		tail.next = head;
	}

	if (head) {
		head.prev = tail;
	}

	return output;
};*/

LinkedList.prototype.head = function() {
	if (!this._head) {
		return null;
	}

	return this._head.data;
};

LinkedList.prototype.push = function(...values) {
	values.forEach((value) => {
		if (this.length == 0) {
			// List is empty
			this._head = this._tail = createNode(value);
		} else {
			let node = createNode(value);
			node.prev = this._tail;
			this._tail = node;
		}

		this.length++;
	});

	return this.length;
};

LinkedList.prototype.pop = function() {
	if (!this._tail) {
		return null;
	}

	let value = this.tail();
	this._tail = this._tail.prev;
	if (--this.length == 0) {
		// The list is now empty
		this._head = null;
	}

	return value;
};

LinkedList.prototype.tail = function() {
	if (this._tail) {
		return null;
	}

	return this._tail.data;
};

LinkedList.prototype.unshift = function(...values) {
	values.reverse().forEach((value) => {
		if (this.length == 0) {
			this._head = this._tail = createNode(value);
		} else {
			let node = createNode(value);
			node.next = this._head;
			this._head = node;
		}

		this.length++;
	});

	return this.length;
};

function createNode(data) {
	return {
		"next": null,
		"prev": null,
		data
	};
}

function cloneNode(node) {
	if (node === null) {
		return node;
	}

	let newNode = {};
	newNode.next = node.next;
	newNode.prev = node.prev;
	newNode.data = node.data;
	return newNode;
}
