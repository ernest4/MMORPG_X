import { Buffer } from "buffer";
import Component from "../ecs/Component";
import { EntityId } from "../ecs/types";
import { isNumber } from "../ecs/utils/Number";
import { SERVER } from "../utils/environment";
import { prettyPrintArray } from "../utils/logging";
import SCHEMA, { LITTLE_ENDIAN, MESSAGE_TYPE, FIELD_TYPES, FIELD_TYPE_BYTES } from "./schema";

// NOTE: ArrayBuffer and DataView work on both Node.js & Browser
// NOTE: TextDecoder/TextEncoder for utf-8 strings only work Browser
// NOTE: 'Buffer' from Node.js will be used to do utf-8 encoding/decoding

// TODO: jests
class Message {
  private _fieldDecoders: {
    [key: string]: (currentByteOffset: number, messageDataView: DataView) => any[];
  };
  private _fieldEncoders: {
    [key: string]: (currentByteOffset: number, messageDataView: DataView, data: any) => number;
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

    this._fieldEncoders = {
      [FIELD_TYPES.UINT_8]: this.writeUInt8,
      [FIELD_TYPES.UINT_16]: this.writeUInt16,
      [FIELD_TYPES.INT_32]: this.writeInt32,
      [FIELD_TYPES.FLOAT_32]: this.writeFloat32,
      [FIELD_TYPES.STRING]: this.writeString,
      [FIELD_TYPES.UINT_16_ARRAY]: this.writeUInt16Array,
      // TODO: ...more?
    };
  }

  parseBinary = (binaryMessage: ArrayBuffer) => {
    const messageDataView = new DataView(binaryMessage);
    let [messageType, currentByteOffset] = this.parseUInt8(MESSAGE_TYPE, messageDataView);

    const messageObject = { messageType };
    SCHEMA[messageType].binary.forEach(([fieldName, fieldType]) => {
      const [data, nextByteOffset] = this._fieldDecoders[fieldType](
        currentByteOffset,
        messageDataView
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

  // // TODO:
  toBinary = (parsedMessage): ArrayBuffer => {
    const errors = this.validate(parsedMessage);
    if (0 < errors.length) throw Error(`Invalid Message Format: ${prettyPrintArray(errors)}`);

    const byteCount = this.getByteCount(parsedMessage);
    const binaryMessage = new ArrayBuffer(byteCount);
    this.populateBinaryMessage(binaryMessage, parsedMessage);
    return binaryMessage;
  };

  // // componentToBinary = (messageComponent) => {};

  private validate = (parsedMessage): any[] => {
    // TODO: validate against schema
    return [];
  };

  // TODO: ..
  private getByteCount = (parsedMessage): number => {
    let byteCount = 1; // message type

    SCHEMA[parsedMessage.messageType].binary.forEach(([fieldName, fieldType]) => {
      let fieldTypeBytes = FIELD_TYPE_BYTES[fieldType]; // try access available
      if (!isNumber(fieldTypeBytes)) {
        // must be one of the unknown in advance types...
        switch (fieldType) {
          case FIELD_TYPES.STRING:
            byteCount = this.getStringByteCount(parsedMessage[fieldName]);
            break;
          case FIELD_TYPES.UINT_16_ARRAY:
            byteCount = this.getNumberArrayByteCount(
              parsedMessage[fieldName],
              FIELD_TYPE_BYTES[FIELD_TYPES.UINT_16]
            );
            break;
          default:
            throw Error(this.getByteCountErrorMessage(fieldType));
        }
      }
      byteCount += fieldTypeBytes;
    });
    return byteCount;
  };

  private getStringByteCount = (string: string): number => {
    if (SERVER) return this.serverGetStringByteCount(string);
    return this.clientGetStringByteCount(string);
  };

  private serverGetStringByteCount = (string: string): number => {
    return Buffer.from(string, "utf8").byteLength;
  };

  private clientGetStringByteCount = (string: string): number => {
    // @ts-ignore
    return new TextEncoder("utf-8").encode(string).byteLength;
  };

  private getNumberArrayByteCount = (array: number[], byteCountPerNumber: number): number => {
    return array.length * byteCountPerNumber;
  };

  private getByteCountErrorMessage = (fieldType: string) => {
    return `getByteCount encountered unrecognized FIELD_TYPE: ${fieldType}.
    Is it a newly added field type of size unknown in advance?
    Make sure getByteCount is updated!`;
  };

  // TODO: ...
  private populateBinaryMessage = (binaryMessage: ArrayBuffer, parsedMessage) => {
    const messageDataView = new DataView(binaryMessage);
    const { messageType } = parsedMessage;
    let currentByteOffset = this.writeUInt8(MESSAGE_TYPE, messageDataView, messageType);

    SCHEMA[messageType].binary.forEach(([fieldName, fieldType]) => {
      const data = parsedMessage[fieldName];
      const nextByteOffset = this._fieldEncoders[fieldType](
        currentByteOffset,
        messageDataView,
        data
      );
      currentByteOffset = nextByteOffset;
    });
  };

  private writeUInt8 = (currentByteOffset: number, dataView: DataView, data: number): number => {
    dataView.setUint8(currentByteOffset, data);
    return currentByteOffset + FIELD_TYPE_BYTES[FIELD_TYPES.UINT_8];
  };

  private writeUInt16 = (currentByteOffset: number, dataView: DataView, data: number): number => {
    dataView.setUint16(currentByteOffset, data, LITTLE_ENDIAN);
    return currentByteOffset + FIELD_TYPE_BYTES[FIELD_TYPES.UINT_16];
  };

  private writeInt32 = (currentByteOffset: number, dataView: DataView, data: number): number => {
    dataView.setInt32(currentByteOffset, data, LITTLE_ENDIAN);
    return currentByteOffset + FIELD_TYPE_BYTES[FIELD_TYPES.INT_32];
  };

  private writeFloat32 = (currentByteOffset: number, dataView: DataView, data: number): number => {
    dataView.setFloat32(currentByteOffset, data, LITTLE_ENDIAN);
    return currentByteOffset + FIELD_TYPE_BYTES[FIELD_TYPES.FLOAT_32];
  };

  private writeString = (currentByteOffset: number, dataView: DataView, data: string): number => {
    if (SERVER) return this.serverWriteString(currentByteOffset, dataView, data);
    return this.clientWriteString(currentByteOffset, dataView, data);
  };

  private serverWriteString = (
    currentByteOffset: number,
    dataView: DataView,
    data: string
  ): number => {
    const uint8array = Buffer.from(data, "utf8");
    for (let i = 0; i < uint8array.byteLength + 1; i++) {
      dataView.setUint8(currentByteOffset + i, uint8array[i]);
    }
    return currentByteOffset + uint8array.byteLength;
  };

  private clientWriteString = (
    currentByteOffset: number,
    dataView: DataView,
    data: string
  ): number => {
    // @ts-ignore
    const uint8array = new TextEncoder("utf-8").encode(data);
    for (let i = 0; i < uint8array.byteLength + 1; i++) {
      dataView.setUint8(currentByteOffset + i, uint8array[i]);
    }
    return currentByteOffset + uint8array.byteLength;
  };

  private writeUInt16Array = (
    currentByteOffset: number,
    dataView: DataView,
    data: number[]
  ): number => {
    // TODO: ...
  };

  private parseUInt8 = (currentByteOffset: number, dataView: DataView) => {
    const data = dataView.getUint8(currentByteOffset);
    return [data, currentByteOffset + FIELD_TYPE_BYTES[FIELD_TYPES.UINT_8]];
  };

  private parseUInt16 = (currentByteOffset: number, dataView: DataView) => {
    const data = dataView.getUint16(currentByteOffset, LITTLE_ENDIAN);
    return [data, currentByteOffset + FIELD_TYPE_BYTES[FIELD_TYPES.UINT_16]];
  };

  private parseInt32 = (currentByteOffset: number, dataView: DataView) => {
    const data = dataView.getInt32(currentByteOffset, LITTLE_ENDIAN);
    return [data, currentByteOffset + FIELD_TYPE_BYTES[FIELD_TYPES.INT_32]];
  };

  private parseFloat32 = (currentByteOffset: number, dataView: DataView) => {
    const data = dataView.getFloat32(currentByteOffset, LITTLE_ENDIAN);
    return [data, currentByteOffset + FIELD_TYPE_BYTES[FIELD_TYPES.FLOAT_32]];
  };

  private parseString = (currentByteOffset: number, dataView: DataView) => {
    if (SERVER) return this.serverParseString(currentByteOffset, dataView);
    return this.clientParseString(currentByteOffset, dataView);
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
