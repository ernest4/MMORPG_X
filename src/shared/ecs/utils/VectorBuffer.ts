// TODO: jests

import { PongMessage } from "../../messages/schema";

// interface VectorBufferItem {
//   constructor(arrayBuffer: ArrayBuffer): VectorBufferItem;
//   // parsedMessage(): ParsedMessage<T>;
//   // synchronizeFrom(parsedMessage: ParsedMessage<T>): void;
//   toArrayBuffer(): ArrayBuffer;
// }

export class VectorBufferItem {
  protected _arrayBuffer: ArrayBuffer;

  constructor(arrayBuffer: ArrayBuffer) {
    this._arrayBuffer = arrayBuffer;
  }
  // parsedMessage(): ParsedMessage<T>;
  // synchronizeFrom(parsedMessage: ParsedMessage<T>): void;
  toArrayBuffer = (): ArrayBuffer => {
    return this._arrayBuffer;
  };
}

// TODO: ...dynamically growing arraybuffer

// class VectorBuffer extends ArrayBuffer {
class VectorBuffer<T extends VectorBufferItem = VectorBufferItem> {
  private _arrayBuffer: ArrayBuffer;
  private _itemCount: number = 0;
  private _itemCapacity: number;
  private _bytesPerItem: number;
  private _currentByteOffset: number = 0;

  constructor(initialItemCapacity: number = 256, bytesPerItem: number) {
    // initialSize represents the item count, not raw bytes. so probs need to lazy init the buffer
    // on first access so that you can see how big items are?
    this._arrayBuffer = new ArrayBuffer(initialItemCapacity * bytesPerItem);
    this._bytesPerItem = bytesPerItem;
    this._itemCapacity = initialItemCapacity;
  }

  push = (item: T): T | null => {
    // TODO: check if there is room
    // resize if needed
    // copy the values to assign (using buffer.set())
    if (this._itemCount === this._itemCapacity) this.grow();
    return this.set(this._itemCount, item);
  };

  get = (position: number): T | null => {
    if (this._itemCapacity <= position) return null;
    if (position < 0) return null;

    const readOffset = position * this._bytesPerItem;
    const arrayBuffer = new Uint8Array(this._arrayBuffer).slice(
      readOffset,
      readOffset + this._bytesPerItem
    ).buffer;

    console.log(arrayBuffer);

    return <T>new VectorBufferItem(arrayBuffer);
  };

  set = (position: number, item: T): T | null => {
    if (this._itemCapacity <= position) return null;
    if (position < 0) return null;

    const itemArrayBuffer = item.toArrayBuffer();
    const writeOffset = position * this._bytesPerItem;

    console.log(this._arrayBuffer);
    new Uint8Array(this._arrayBuffer).set(new Uint8Array(itemArrayBuffer), writeOffset);
    console.log(this._arrayBuffer);
    this._itemCount++;
  };

  get byteLength(): number {
    return this._arrayBuffer.byteLength;
  }

  get size(): number {
    return this._itemCount;
  }

  get capacity(): number {
    return this._itemCapacity;
  }

  each = (callback: (item: T) => void) => {
    // TODO: ...
  };

  // double the size
  private grow = () => {
    var newArrayBuffer = new ArrayBuffer(this._arrayBuffer.byteLength * 2);
    new Uint8Array(newArrayBuffer).set(new Uint8Array(this._arrayBuffer));
    this._itemCapacity = this._itemCapacity * 2;
  };
}

export default VectorBuffer;
