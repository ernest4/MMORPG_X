import { Buffer } from "buffer";
import { SERVER } from "../utils/environment";
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
      [TYPES.STRING]: this.parseString,
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
    SCHEMA[messageType].forEach(([fieldName, fieldType]) => {
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

  private parseString = (currentOffset: number, binaryMessageView: DataView) => {
    if (SERVER) return this.serverParseString(currentOffset, binaryMessageView);
    return this.clientParseString(currentOffset, binaryMessageView);
  };

  private serverParseString = (currentOffset: number, { buffer: arrayBuffer }) => {
    const textSlice = arrayBuffer.slice(currentOffset, arrayBuffer.byteLength);
    const data = Buffer.from(textSlice).toString("utf-8");

    // NOTE: next offset not super useful here as strings will be the last component in any message
    // since they're final size is unknown.
    return [data, currentOffset + textSlice.byteLength];
  };

  private clientParseString = (currentOffset: number, { buffer: arrayBuffer }) => {
    const textSlice = arrayBuffer.slice(currentOffset, arrayBuffer.byteLength);
    // @ts-ignore
    const data = new TextDecoder("utf-8").decode(textSlice);

    // NOTE: next offset not super useful here as strings will be the last component in any message
    // since they're final size is unknown.
    return [data, currentOffset + textSlice.byteLength];
  };
}

export default Message;
