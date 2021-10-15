import { Buffer } from "buffer";
import MessageComponent from "./Message";
import { EntityId } from "../../ecs/types";
import { SERVER } from "../../utils/environment";
import SCHEMA, {
  LITTLE_ENDIAN,
  MESSAGE_TYPE_POSITION,
  FIELD_TYPES,
  FIELD_TYPE_BYTES,
  FIELD_TYPE,
} from "../schema";

// NOTE: ArrayBuffer and DataView work on both Node.js & Browser
// NOTE: TextDecoder/TextEncoder for utf-8 strings only work Browser
// NOTE: 'Buffer' from Node.js will be used to do utf-8 encoding/decoding

// TODO: jests
class Reader {
  private _fieldDecoders: {
    [K in FIELD_TYPE]: (currentByteOffset: number, messageDataView: DataView) => any[];
  };

  constructor() {
    // NOTE: the [K in FIELD_TYPE]: ... above enforces that ALL field types are present in the hash
    // and thus will have a decoder function !!
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
    const messageDataView = new DataView(binaryMessage);
    let [messageType, currentByteOffset] = this.parseUInt8(MESSAGE_TYPE_POSITION, messageDataView);

    const messageObject = { messageType };
    SCHEMA[messageType].binary.forEach(([fieldName, fieldType]: [string, FIELD_TYPE]) => {
      const fieldDecoder = this._fieldDecoders[fieldType];
      const [data, nextByteOffset] = fieldDecoder(currentByteOffset, messageDataView);
      messageObject[fieldName] = data;
      currentByteOffset = nextByteOffset;
    });
    return messageObject;
  };

  binaryToMessageComponent = (
    messageComponentEntityId: EntityId,
    binaryMessage: ArrayBuffer,
    fromEntityId?: EntityId
  ): MessageComponent => {
    const parsedMessage = this.parseBinary(binaryMessage);
    const messageComponent = new SCHEMA[parsedMessage.messageType].component(
      messageComponentEntityId,
      parsedMessage,
      fromEntityId
    );
    return messageComponent;
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

    // NOTE: next offset not super useful here as strings will be the last item in any message
    // since they're final size is unknown.
    return [data, currentByteOffset + textSlice.byteLength];
  };

  private clientParseString = (currentByteOffset: number, { buffer: arrayBuffer }) => {
    const textSlice = arrayBuffer.slice(currentByteOffset, arrayBuffer.byteLength);
    // @ts-ignore
    const data = new TextDecoder("utf-8").decode(textSlice);

    // NOTE: next offset not super useful here as strings will be the last item in any message
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

    // NOTE: next offset not super useful here as array will be the last item in any message
    // since its final size is unknown.
    return [data, currentByteOffset + arrayBinaryView.byteLength];
  };
}

export default new Reader();
