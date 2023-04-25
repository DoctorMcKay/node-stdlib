interface QueueNode {
	data: any,
	next?: QueueNode,
	prev?: QueueNode
}

export default class Queue {
	#length: number;
	#tail?: QueueNode;
	#head?: QueueNode;

	/**
	 * Create a new Queue. A Queue is a FIFO data structure, in which all you can do is append items and remove items from
	 * the front. Under the hood, this is implemented with a doubly-linked list (DLL).
	 * @constructor
	 */
	constructor() {
		this.#length = 0;
		this.#head = null;
		this.#tail = null;
	}

	get length() {
		return this.#length;
	}

	/**
	 * Push a new item to the end of the queue.
	 * @param {*} item - The item to push into the queue
	 * @return {int} The new length of the queue
	 */
	enqueue(item: any): number {
		// Create the DLL node. The "next" pointer is empty and the "prev" pointer is the existing tail of the list.
		let entry:QueueNode = {data: item, next: null, prev: this.#tail};

		if (this.#tail) {
			// If we already have a tail, make its next pointer point to this node.
			this.#tail.next = entry;
		}

		if (!this.#head) {
			// If the list was empty, this is also the new head
			this.#head = entry;
		}

		// This node is now our new tail
		this.#tail = entry;
		return ++this.#length;
	}

	push(item: any): number {
		return this.enqueue(item);
	}

	/**
	 * Inserts a new item into the front of the queue.
	 * @param {*} item - The item to insert into the queue
	 * @return {int} The new length of the queue
	 */
	insert(item: any): number {
		let entry:QueueNode = {data: item, next: this.#head, prev: null};
		this.#head = entry;

		// If we didn't previously have a tail, make this the tail as well
		if (!this.#tail) {
			this.#tail = entry;
		}

		return ++this.#length;
	}

	/**
	 * Remove the first element from the queue and return it.
	 * @return {*} The first item in the queue. Null if the queue is empty.
	 */
	dequeue(): any {
		if (!this.#head) {
			return null;
		}

		let entry = this.#head.data;
		// remove it from the list
		this.#head = this.#head.next;
		if (!this.#head) {
			// the list is now empty
			this.#tail = null;
		}

		this.#length--;
		return entry;
	}

	pop(): any {
		return this.dequeue();
	}

	/**
	 * Empty this queue by removing all items in it.
	 */
	empty(): void {
		this.#head = null;
		this.#tail = null;
		this.#length = 0;
	}
}
