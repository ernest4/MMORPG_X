import { Buffer } from "buffer";
import Component from "../ecs/Component";
import { EntityId } from "../ecs/types";
import { SERVER } from "../utils/environment";
import SCHEMA, { LITTLE_ENDIAN, MESSAGE_TYPE, FIELD_TYPES } from "./schema";

// NOTE: ArrayBuffer and DataView work on both Node.js & Browser
// NOTE: TextDecoder/TextEncoder for utf-8 strings only work Browser
// NOTE: 'Buffer' from Node.js will be used to do utf-8 encoding/decoding

// TODO: jests
class Message {
  private _fieldDecoders: {
    [key: string]: (currentByteOffset: number, binaryMessageView: DataView) => any[];
  };

  constructor() {
    this._fieldDecoders = {
      [FIELD_TYPES.UINT_8]: this.parseUInt8,
      [FIELD_TYPES.UINT_16]: this.parseUInt16,
      [FIELD_TYPES.INT_32]: this.parseInt32,
      [FIELD_TYPES.FLOAT_32]: this.parseFloat32,
      [FIELD_TYPES.STRING]: this.parseString,
      [FIELD_TYPES.UINT_16_ARRAY]: this.parseUInt16Array,
      // TODO: ...more?
    };
  }

  parseBinary = (binaryMessage: ArrayBuffer) => {
    const binaryMessageView = new DataView(binaryMessage);
    let [messageType, currentByteOffset] = this.parseUInt8(MESSAGE_TYPE, binaryMessageView);

    const messageObject = { messageType };
    SCHEMA[messageType].binary.forEach(([fieldName, fieldType]) => {
      const [data, nextByteOffset] = this._fieldDecoders[fieldType](
        currentByteOffset,
        binaryMessageView
      );
      messageObject[fieldName] = data;
      currentByteOffset = nextByteOffset;
    });
    return messageObject;
  };

  binaryToComponent = (
    messageComponentEntityId: EntityId,
    fromEntityId: EntityId | null,
    binaryMessage: ArrayBuffer
  ): Component => {
    const parsedMessage = this.parseBinary(binaryMessage);
    const messageComponent = new SCHEMA[parsedMessage.messageType].component(
      messageComponentEntityId,
      fromEntityId,
      parsedMessage
    );
    return messageComponent;
  };

  // TODO:
  // toBinary = (parsedMessage) => {};
  // componentToBinary = (messageComponent) => {};

  private parseUInt8 = (currentByteOffset: number, binaryMessageView: DataView) => {
    const data = binaryMessageView.getUint8(currentByteOffset);
    return [data, currentByteOffset + 1];
  };

  private parseUInt16 = (currentByteOffset: number, binaryMessageView: DataView) => {
    const data = binaryMessageView.getUint16(currentByteOffset, LITTLE_ENDIAN);
    return [data, currentByteOffset + 2];
  };

  private parseInt32 = (currentByteOffset: number, binaryMessageView: DataView) => {
    const data = binaryMessageView.getInt32(currentByteOffset, LITTLE_ENDIAN);
    return [data, currentByteOffset + 4];
  };

  private parseFloat32 = (currentByteOffset: number, binaryMessageView: DataView) => {
    const data = binaryMessageView.getFloat32(currentByteOffset, LITTLE_ENDIAN);
    return [data, currentByteOffset + 4];
  };

  private parseString = (currentByteOffset: number, binaryMessageView: DataView) => {
    if (SERVER) return this.serverParseString(currentByteOffset, binaryMessageView);
    return this.clientParseString(currentByteOffset, binaryMessageView);
  };

  private serverParseString = (currentByteOffset: number, { buffer: arrayBuffer }) => {
    const textSlice = arrayBuffer.slice(currentByteOffset, arrayBuffer.byteLength);
    const data = Buffer.from(textSlice).toString("utf-8");

    // NOTE: next offset not super useful here as strings will be the last component in any message
    // since they're final size is unknown.
    return [data, currentByteOffset + textSlice.byteLength];
  };

  private clientParseString = (currentByteOffset: number, { buffer: arrayBuffer }) => {
    const textSlice = arrayBuffer.slice(currentByteOffset, arrayBuffer.byteLength);
    // @ts-ignore
    const data = new TextDecoder("utf-8").decode(textSlice);

    // NOTE: next offset not super useful here as strings will be the last component in any message
    // since they're final size is unknown.
    return [data, currentByteOffset + textSlice.byteLength];
  };

  private parseUInt16Array = (currentByteOffset: number, { buffer: arrayBuffer }) => {
    // NOTE: not using Uint16Array because it only uses platform default byte order, while I want to
    // force little endian for consistency!
    const arrayBinaryView = new DataView(arrayBuffer, currentByteOffset);
    let data: number[] = [];
    let currentArrayOffset = 0;

    while (currentArrayOffset < arrayBinaryView.byteLength) {
      const [datum, nextArrayOffset] = this.parseUInt16(currentArrayOffset, arrayBinaryView);
      data.push(datum);
      currentArrayOffset = nextArrayOffset;
    }

    // NOTE: next offset not super useful here as array will be the last component in any message
    // since its final size is unknown.
    return [data, currentByteOffset + arrayBinaryView.byteLength];
  };
}

export default Message;
