// const buffer = new ArrayBuffer(4);
// const view = new DataView(buffer);

import SCHEMA, { TYPES } from "./schema";

// view.setUint16(0, 5, true);
// console.log(view);
// console.log(view.getUint16(0, true));

// NOTE: ArrayBuffer and DataView work on both Node.js & Browser
// NOTE: TextDecoder/TextEncoder for utf-8 strings only work Browser
// NOTE: 'Buffer' from Node.js will be used to do utf-8 encoding/decoding

// const ENCODERS = {
//   // TODO: ...
// }

class Message {
  constructor() {
    // TODO: ...
    this._decoders = {
      // TODO: ...point to internal functions of Message
      [TYPES.INT_32]: this.parseInt32,
      [TYPES.FLOAT_32]: this.parseFloat32,
    };
  }

  // TODO: accepts either binary or MessageEvent
  // parse = () => {};

  parseBinary = (binaryMessage: ArrayBuffer) => {
    const binaryMessageView = new DataView(binaryMessage);
    const messageType = binaryMessageView.getUint8(0);
    let currentOffset = 1;

    const messageObject = {};
    SCHEMA[messageType].forEeach(([fieldName, fieldType]) => {
      const [data, nextOffset] = this._decoders[fieldType](currentOffset, binaryMessageView);
      messageObject[fieldName] = data;
      currentOffset = nextOffset;
    });

    return messageObject;
  };

  // TODO: ...
  // parseMessageEvent = () => {};

  // TODO: ...
  // binaryToComponent = () => {};

  // TODO: ...
  // messageEventToComponent = () => {};

  // TODO: write / serialize

  private parseInt32 = (currentOffset, binaryMessageView) => {
    const data = binaryMessageView.getInt32(currentOffset, true);
    return [data, currentOffset + 4];
  };

  // TODO: ...
  // private parseFloat32 = () => {};
}

export default Message;
