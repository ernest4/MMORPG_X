import { Buffer } from "buffer";
import MessageComponent from "../../components/Message";
import { isNumber } from "../../ecs/utils/Number";
import { SERVER } from "../../utils/environment";
import { prettyPrintArray } from "../../utils/logging";
import Validator from "./Validator";
import SCHEMA, {
  LITTLE_ENDIAN,
  MESSAGE_TYPE,
  FIELD_TYPES,
  FIELD_TYPE_BYTES,
  FIELD_TYPE,
} from "../schema";

// NOTE: ArrayBuffer and DataView work on both Node.js & Browser
// NOTE: TextDecoder/TextEncoder for utf-8 strings only work Browser
// NOTE: 'Buffer' from Node.js will be used to do utf-8 encoding/decoding

// TODO: jests
class Writer {
  private _fieldEncoders: {
    [K in FIELD_TYPE]: (currentByteOffset: number, messageDataView: DataView, data: any) => number;
  };

  constructor() {
    // NOTE: the [K in FIELD_TYPE]: ... above enforces that ALL field types are present in the hash
    // and thus will have a decoder function !!
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

  toBinary = (parsedMessage): ArrayBuffer => {
    const errors = Validator.validate(parsedMessage);
    if (0 < errors.length) throw Error(`Invalid Message Format: ${prettyPrintArray(errors)}`);

    const byteCount = this.getByteCount(parsedMessage);
    const binaryMessage = new ArrayBuffer(byteCount);
    this.populateBinaryMessage(binaryMessage, parsedMessage);
    return binaryMessage;
  };

  messageComponentToBinary = (messageComponent: MessageComponent): ArrayBuffer => {
    return this.toBinary(messageComponent.parsedMessage);
  };

  private getByteCount = (parsedMessage): number => {
    let byteCount = 1; // message type

    SCHEMA[parsedMessage.messageType].binary.forEach(
      ([fieldName, fieldType]: [string, FIELD_TYPE]) => {
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
      }
    );
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

  private getByteCountErrorMessage = (fieldType: FIELD_TYPE) => {
    return `getByteCount encountered unrecognized FIELD_TYPE: ${fieldType}.
    Is it a newly added field type of size unknown in advance?
    Make sure all methods are updated!`;
  };

  private populateBinaryMessage = (binaryMessage: ArrayBuffer, parsedMessage) => {
    const messageDataView = new DataView(binaryMessage);
    const { messageType } = parsedMessage;
    let currentByteOffset = this.writeUInt8(MESSAGE_TYPE, messageDataView, messageType);

    SCHEMA[messageType].binary.forEach(([fieldName, fieldType]: [string, FIELD_TYPE]) => {
      const data = parsedMessage[fieldName];
      const fieldEncoder = this._fieldEncoders[fieldType];
      const nextByteOffset = fieldEncoder(currentByteOffset, messageDataView, data);
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

  // TODO: comments like this everywhere?? code should be self documenting though...
  /**
   * Stores an array of Uint16 values at the specified byte offset in the given DataView.
   * @param currentByteOffset The place in the buffer at which the values should be set from.
   * @param dataView The DataView to set numbers in.
   * @param data The array of numbers to set.
   */
  private writeUInt16Array = (
    currentByteOffset: number,
    dataView: DataView,
    data: number[]
  ): number => {
    data.forEach(number => {
      const nextByteOffset = this.writeUInt16(currentByteOffset, dataView, number);
      currentByteOffset = nextByteOffset;
    });

    return currentByteOffset;
  };
}

// returning singleton. Doesn't need to be class at all tbh, but might be useful to have some state
// in the future, so keeping like this for now
export default new Writer();
