class Node {
  public readonly value: any;
  public next: Node | null = null;

  constructor(value: any) {
    this.value = value;
  }
}


export class Queue {
  private _head: Node;
  private _tail: Node;
  private _length: number = 0;

  constructor(sentinelValue: any = null) {
    this._head = this._tail = new Node(sentinelValue);
  }

  get length(): number {
    return this._length;
  }

  get first(): any {
    return this._head.next ? this._head.next.value : null;
  }

  get head(): Node {
    return this._head;
  }

  get tail(): Node {
    return this._tail;
  }

  [Symbol.iterator]() {
    return this.iter();
  }

  enqueue(value: any) {
    this._tail = this._tail.next = new Node(value);
    this._length++;
  }

  dequeue(): any {
    if (!this._head.next) return null;
    this._head.next = this._head.next.next;
    this._length--;
  }

  iter() {
    let prev: Node | null = this._head;
    let curr = this._head.next;

    return {
      next() {
        [prev, curr] = [curr, curr?.next || null];

        return {
          value: prev?.value,
          node: prev,
          done: !prev
        };
      }
    }
  }
}
