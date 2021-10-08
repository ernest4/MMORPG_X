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
    [key: string]: (currentOffset: number, binaryMessageView: DataView) => any[];
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
    let [messageType, currentOffset] = this.parseUInt8(MESSAGE_TYPE, binaryMessageView);

    const messageObject = { messageType };
    SCHEMA[messageType].binary.forEach(([fieldName, fieldType]) => {
      const [data, nextOffset] = this._fieldDecoders[fieldType](currentOffset, binaryMessageView);
      messageObject[fieldName] = data;
      currentOffset = nextOffset;
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

  private parseUInt8 = (currentOffset: number, binaryMessageView: DataView) => {
    const data = binaryMessageView.getUint8(currentOffset);
    return [data, currentOffset + 1];
  };

  private parseUInt16 = (currentOffset: number, binaryMessageView: DataView) => {
    const data = binaryMessageView.getUint16(currentOffset, LITTLE_ENDIAN);
    return [data, currentOffset + 2];
  };

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

  private parseUInt16Array = (currentOffset: number, { buffer: arrayBuffer }) => {
    // NOTE: not using Uint16Array because it only uses platform default byte order, while I want to
    // force little endian for consistency!
    const arrayBinaryView = new DataView(arrayBuffer, currentOffset);
    let data: number[] = [];
    let currentArrayOffset = 0;

    while (currentArrayOffset < arrayBinaryView.byteLength) {
      const [datum, nextArrayOffset] = this.parseUInt16(currentArrayOffset, arrayBinaryView);
      data.push(datum);
      currentArrayOffset = nextArrayOffset;
    }

    // NOTE: next offset not super useful here as array will be the last component in any message
    // since its final size is unknown.
    return [data, currentOffset + arrayBinaryView.byteLength];
  };
}

export default Message;
