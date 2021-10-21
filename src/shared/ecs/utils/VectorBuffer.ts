// TODO: jests

import { PongMessage } from "../../messages/schema";

interface VectorBufferItem {
  // parsedMessage(): ParsedMessage<T>;
  // synchronizeFrom(parsedMessage: ParsedMessage<T>): void;
  toArrayBuffer(): ArrayBuffer;
}

// TODO: ...dynamically growing arraybuffer

// class VectorBuffer extends ArrayBuffer {
class VectorBuffer<T extends VectorBufferItem> {
  private _arrayBuffer: ArrayBuffer;
  private _elementCount: number = 0;

  constructor(initialSize: number = 256) {
    // initialSize represents the item count, not raw bytes. so probs need to lazy init the buffer
    // on first access so that you can see how big items are?
    // this._arrayBuffer = new ArrayBuffer(initialSize);
  }

  push = (item: T) => {
    // TODO: check if there is room
    // resize if needed
    // copy the values to assign (using buffer.set())
  };

  get = (position: number): T | null => {
    if (this._elementCount <= position) return null;
    if (position < 0) return null;
    // TODO: ...
    // ...
  };

  set = (position: number, item: T): T | null => {
    if (this._elementCount <= position) return null;
    if (position < 0) return null;
    // TODO: ...
    // ...
  };

  get byteLength(): number {
    return this._arrayBuffer.byteLength;
  }
}

export default VectorBuffer;
