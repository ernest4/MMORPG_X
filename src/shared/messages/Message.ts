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

const LITTLE_ENDIAN = true;
// TODO: jests
class Message {
  private _decoders: {
    [key: string]: (currentOffset: number, binaryMessageView: DataView) => any[];
  };

  constructor() {
    this._decoders = {
      [TYPES.INT_32]: this.parseInt32,
      [TYPES.FLOAT_32]: this.parseFloat32,
      // TODO: ...rest
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

  private parseInt32 = (currentOffset: number, binaryMessageView: DataView) => {
    const data = binaryMessageView.getInt32(currentOffset, LITTLE_ENDIAN);
    return [data, currentOffset + 4];
  };

  private parseFloat32 = (currentOffset: number, binaryMessageView: DataView) => {
    const data = binaryMessageView.getFloat32(currentOffset, LITTLE_ENDIAN);
    return [data, currentOffset + 4];
  };
}

export default Message;


case MESSAGE_TYPE.PING: {
  // [type,string]

  const decoder = new TextDecoder("utf-8");
  const textSlice = data.slice(1, data.byteLength);
  const ping = decoder.decode(textSlice);

  // TODO: add the image / texture info for character appearance (send key)
  const message_object = { messageType, ping };

  console.log(message_object);

  return message_object;
}
case: {
}