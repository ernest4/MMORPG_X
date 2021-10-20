import { Buffer } from "buffer";
import { EntityId } from "../../ecs/types";
import { SERVER } from "../../utils/environment";
import {
  LITTLE_ENDIAN,
  MESSAGE_TYPE_POSITION,
  FIELD_TYPES,
  FIELD_TYPE,
  BinaryOrder,
  FieldName,
  MESSAGE_TYPE,
  ParsedMessage,
  Schema,
} from "../schema";
import Message from "../../components/Message";

// NOTE: ArrayBuffer and DataView work on both Node.js & Browser
// NOTE: TextDecoder/TextEncoder for utf-8 strings only work Browser
// NOTE: 'Buffer' from Node.js will be used to do utf-8 encoding/decoding

// TODO: jests
class Reader {
  private _schema: Schema;
  private _fieldDecoders: {
    [K in FIELD_TYPE]: (currentByteOffset: number, messageDataView: DataView) => any[];
  };

  constructor(schema: Schema) {
    this._schema = schema;
    // NOTE: the [K in FIELD_TYPE]: ... above enforces that ALL field types are present in the hash
    // and thus will have a decoder function !!
    this._fieldDecoders = {
      [FIELD_TYPE.UINT_8]: this.parseUInt8,
      [FIELD_TYPE.UINT_16]: this.parseUInt16,
      [FIELD_TYPE.INT_32]: this.parseInt32,
      [FIELD_TYPE.FLOAT_32]: this.parseFloat32,
      [FIELD_TYPE.STRING]: this.parseString,
      [FIELD_TYPE.UINT_16_ARRAY]: this.parseUInt16Array,
      // TODO: ...more?
    };
  }

  binaryToMessageComponent = (
    messageComponentEntityId: EntityId,
    binaryMessage: ArrayBuffer,
    from?: EntityId
  ): Message<any> => {
    const { parsedMessage } = this.parseBinary(binaryMessage);
    const messageComponentClass = this._schema[parsedMessage.messageType].component;
    return new messageComponentClass(messageComponentEntityId, parsedMessage, from);
  };

  private parseBinary = (binaryMessage: ArrayBuffer): { parsedMessage: ParsedMessage<any> } => {
    const messageDataView = new DataView(binaryMessage);
    let [messageType, currentByteOffset] = <[MESSAGE_TYPE, number]>(
      this.parseUInt8(MESSAGE_TYPE_POSITION, messageDataView)
    );

    const parsedMessage = { messageType };
    const parsedMessageEntries = <[FieldName, [FIELD_TYPE, BinaryOrder]][]>(
      Object.entries(this._schema[messageType].parsedMessage)
    );
    const binaryOrderedParsedMessageEntries = this.toBinaryOrder(parsedMessageEntries);
    binaryOrderedParsedMessageEntries.forEach(([fieldName, fieldType]) => {
      const fieldDecoder = this._fieldDecoders[fieldType];
      const [data, nextByteOffset] = fieldDecoder(currentByteOffset, messageDataView);
      parsedMessage[fieldName] = data;
      currentByteOffset = nextByteOffset;
    });
    return { parsedMessage };
  };

  // TODO: extract? same method as on Reader...
  private toBinaryOrder = (
    parsedMessageEntries: [FieldName, [FIELD_TYPE, BinaryOrder]][]
  ): [FieldName, FIELD_TYPE][] => {
    const binaryOrderedParsedMessageEntries = [];
    parsedMessageEntries.forEach(([fieldName, [fieldType, binaryOrder]]) => {
      binaryOrderedParsedMessageEntries[binaryOrder] = [fieldName, fieldType];
    });
    return binaryOrderedParsedMessageEntries;
  };

  private parseUInt8 = (currentByteOffset: number, dataView: DataView) => {
    const data = dataView.getUint8(currentByteOffset);
    return [data, currentByteOffset + FIELD_TYPES[FIELD_TYPE.UINT_8].bytes];
  };

  private parseUInt16 = (currentByteOffset: number, dataView: DataView) => {
    const data = dataView.getUint16(currentByteOffset, LITTLE_ENDIAN);
    return [data, currentByteOffset + FIELD_TYPES[FIELD_TYPE.UINT_16].bytes];
  };

  private parseInt32 = (currentByteOffset: number, dataView: DataView) => {
    const data = dataView.getInt32(currentByteOffset, LITTLE_ENDIAN);
    return [data, currentByteOffset + FIELD_TYPES[FIELD_TYPE.INT_32].bytes];
  };

  private parseFloat32 = (currentByteOffset: number, dataView: DataView) => {
    const data = dataView.getFloat32(currentByteOffset, LITTLE_ENDIAN);
    return [data, currentByteOffset + FIELD_TYPES[FIELD_TYPE.FLOAT_32].bytes];
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

export default Reader;
