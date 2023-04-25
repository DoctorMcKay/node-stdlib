interface StackNode {
	data: any;
	prev?: StackNode;
}

export default class Stack {
	#length: number;
	#tail?: StackNode;

	/**
	 * Create a new Stack. A Stack is a FILO data structure, in which all you can do is append items and remove items from
	 * the back. Under the hood, this is implemented with a linked list (LL).
	 * @constructor
	 */
	constructor() {
		this.#length = 0;
		this.#tail = null;
	}

	get length() {
		return this.#length;
	}

	/**
	 * Push a new item to the top of the stack.
	 * @param {*} item - The item to push into the stack
	 * @return {int} The new length of the stack
	 */
	push(item: any): number {
		// Create the LL node. The "prev" pointer is the existing tail of the list.
		this.#tail = {data: item, prev: this.#tail};
		return ++this.#length;
	}

	/**
	 * Remove the top element from the stack and return it.
	 * @return {*} The top item in the stack. Null if the stack is empty.
	 */
	pop() {
		if (!this.#tail) {
			return null;
		}

		let entry = this.#tail.data;
		this.#tail = this.#tail.prev;
		this.#length--;
		return entry;
	}

	/**
	 * Empty this stack by removing all items in it.
	 */
	empty() {
		this.#tail = null;
		this.#length = 0;
	}
}
