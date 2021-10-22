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
  private _growthFactor: number;

  constructor(initialItemCapacity: number = 256, bytesPerItem: number, growthFactor: number = 2) {
    // initialSize represents the item count, not raw bytes. so probs need to lazy init the buffer
    // on first access so that you can see how big items are?
    this._arrayBuffer = new ArrayBuffer(initialItemCapacity * bytesPerItem);
    this._bytesPerItem = bytesPerItem;
    this._itemCapacity = initialItemCapacity;
    this._growthFactor = growthFactor;
  }

  push = (item: T): T | null => {
    if (this._itemCapacity <= this._itemCount) this.grow();
    return this.set(this._itemCount, item);
  };

  // TODO: jests
  get = (position: number): T | null => {
    if (this._itemCapacity <= position) return null;
    if (position < 0) return null;

    const readOffset = position * this._bytesPerItem;
    const arrayBuffer = new Uint8Array(this._arrayBuffer).slice(
      readOffset,
      readOffset + this._bytesPerItem
    ).buffer;

    return <T>new VectorBufferItem(arrayBuffer);
  };

  // TODO: jests
  set = (position: number, item: T): T | null => {
    if (this._itemCapacity <= position) return null;
    if (position < 0) return null;

    const itemArrayBuffer = item.toArrayBuffer();
    const writeOffset = position * this._bytesPerItem;

    new Uint8Array(this._arrayBuffer).set(new Uint8Array(itemArrayBuffer), writeOffset);
    this._itemCount++;
    return item;
  };

  // TODO: jests
  get byteLength(): number {
    return this._arrayBuffer.byteLength;
  }

  // TODO: jests
  get size(): number {
    return this._itemCount;
  }

  // TODO: jests
  get capacity(): number {
    return this._itemCapacity;
  }

  // TODO: jests 50%
  each = (callback: (item: T) => void) => {
    const elementCount = this._itemCount;
    for (let i = 0; i < elementCount; i++) callback(this.get(i));
  };

  // double the size
  private grow = () => {
    const newArrayBuffer = new ArrayBuffer(this._arrayBuffer.byteLength * this._growthFactor);
    new Uint8Array(newArrayBuffer).set(new Uint8Array(this._arrayBuffer));
    this._arrayBuffer = newArrayBuffer;
    this._itemCapacity = this._itemCapacity * this._growthFactor;
  };
}

export default VectorBuffer;
