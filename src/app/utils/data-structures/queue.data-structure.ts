class Node {
  public readonly value: any;
  public next: Node | null = null;

  constructor(value: any) {
    this.value = value;
  }
}


export class Queue {
  private head: Node | null;
  private tail: Node | null;
  private _length: number = 0;

  constructor() {
    this.head = this.tail = null;
  }

  get length(): number {
    return this._length;
  }

  get first(): any {
    return this.head?.value;
  }

  enqueue(value: any) {
    const node = new Node(value);
    if (!this._length) this.head = this.tail = node;
    else this.tail = this.tail!.next = node;
    this._length++;
  }

  dequeue(): any {
    if (!this._length) return null;
    this.head = this.head!.next;
    if (!this.head) this.tail = null;
    this._length--;
  }
}
