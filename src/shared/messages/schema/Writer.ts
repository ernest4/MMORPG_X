import { Buffer } from "buffer";
// import Message from "../../components/Message";
import { isNumber } from "../../ecs/utils/Number";
import { SERVER } from "../../utils/environment";
import { prettyPrintArray } from "../../utils/logging";
import Validator from "./Validator";
import SCHEMA, {
  LITTLE_ENDIAN,
  MESSAGE_TYPE_POSITION,
  FIELD_TYPES,
  FIELD_TYPE,
  MESSAGE_TYPE,
  BinaryOrder,
  FieldName,
  UNKNOWN,
  ParsedMessage,
  Schema,
} from "../schema";
import OutMessage from "../../components/OutMessage";

// TODO: jests
class Writer {
  private _fieldEncoders: {
    [K in FIELD_TYPE]: (currentByteOffset: number, messageDataView: DataView, data: any) => number;
  };

  constructor() {
    // NOTE: the [K in FIELD_TYPE]: ... above enforces that ALL field types are present in the hash
    // and thus will have a decoder function !!
    this._fieldEncoders = {
      [FIELD_TYPE.UINT_8]: this.writeUInt8,
      [FIELD_TYPE.UINT_16]: this.writeUInt16,
      [FIELD_TYPE.INT_32]: this.writeInt32,
      [FIELD_TYPE.FLOAT_32]: this.writeFloat32,
      [FIELD_TYPE.STRING]: this.writeString,
      [FIELD_TYPE.UINT_16_ARRAY]: this.writeUInt16Array,
      // TODO: ...more?
    };
  }

  messageComponentToBinary = <T extends MESSAGE_TYPE>({
    parsedMessage,
  }: OutMessage<T>): ArrayBuffer => {
    console.log(parsedMessage); // TODO: remove this debug log
  
    return this.toBinary(parsedMessage);
  };

  private toBinary = <T extends MESSAGE_TYPE>(parsedMessage: ParsedMessage<T>): ArrayBuffer => {
    // // TODO: re-enablee validation...
    // const errors = Validator.validate(messageType, parsedMessage);
    // // TODO: console log only? rollbar?
    // if (0 < errors.length) throw Error(`Invalid Message Format: ${prettyPrintArray(errors)}`);

    const byteCount = this.getByteCount(parsedMessage);
    const binaryMessage = new ArrayBuffer(byteCount);
    this.populateBinaryMessage(binaryMessage, parsedMessage);
    return binaryMessage;
  };

  private getByteCount = <T extends MESSAGE_TYPE>(parsedMessage: ParsedMessage<T>): number => {
    let byteCount = 1; // message type

    const parsedMessageEntries = this.messageTypeToParsedMessageEntries(parsedMessage.messageType);
    parsedMessageEntries.forEach(
      ([fieldName, [fieldType, binaryOrder]]: [FieldName, [FIELD_TYPE, BinaryOrder]]) => {
        let fieldTypeBytes = FIELD_TYPES[fieldType].bytes; // try access available
        if (fieldTypeBytes === UNKNOWN) {
          // must be one of the unknown in advance types...
          switch (fieldType) {
            case FIELD_TYPE.STRING:
              byteCount += this.getStringByteCount(parsedMessage[fieldName]);
              return;
            case FIELD_TYPE.UINT_16_ARRAY:
              byteCount += this.getNumberArrayByteCount(
                parsedMessage[fieldName],
                FIELD_TYPES[FIELD_TYPE.UINT_16].bytes
              );
              return;
            default:
              // TODO: console log only? rollbar?
              throw Error(this.getByteCountErrorMessage(fieldType));
          }
        } else byteCount += fieldTypeBytes;
      }
    );
    return byteCount;
  };

  private messageTypeToParsedMessageEntries = (
    messageType: MESSAGE_TYPE
  ): [FieldName, [FIELD_TYPE, BinaryOrder]][] => Object.entries(SCHEMA[messageType].parsedMessage);

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

  private getStringByteCount = (string: string): number => {
    // if (SERVER) return this.serverGetStringByteCount(string);
    // return this.clientGetStringByteCount(string);

    // apparently node 11 now supports text(de)encoder
    // @ts-ignore
    return new TextEncoder("utf-8").encode(string).byteLength;
  };

  // private serverGetStringByteCount = (string: string): number => {
  //   return Buffer.from(string, "utf8").byteLength;
  // };

  // private clientGetStringByteCount = (string: string): number => {
  //   // @ts-ignore
  //   return new TextEncoder("utf-8").encode(string).byteLength;
  // };

  private getNumberArrayByteCount = (array: number[], byteCountPerNumber: number): number => {
    return array.length * byteCountPerNumber;
  };

  private getByteCountErrorMessage = (fieldType: FIELD_TYPE) => {
    return `getByteCount encountered unrecognized FIELD_TYPE: ${fieldType}.
    Is it a newly added field type of size unknown in advance?
    Make sure all methods are updated!`;
  };

  private populateBinaryMessage = <T extends MESSAGE_TYPE>(
    binaryMessage: ArrayBuffer,
    parsedMessage: ParsedMessage<T>
  ) => {
    const messageDataView = new DataView(binaryMessage);
    let currentByteOffset = this.writeUInt8(
      MESSAGE_TYPE_POSITION,
      messageDataView,
      parsedMessage.messageType
    );

    const parsedMessageEntries = this.messageTypeToParsedMessageEntries(parsedMessage.messageType);
    const binaryOrderedParsedMessageEntries = this.toBinaryOrder(parsedMessageEntries);
    binaryOrderedParsedMessageEntries.forEach(([fieldName, fieldType]: [string, FIELD_TYPE]) => {
      const data = parsedMessage[fieldName];
      const fieldEncoder = this._fieldEncoders[fieldType];
      const nextByteOffset = fieldEncoder(currentByteOffset, messageDataView, data);
      currentByteOffset = nextByteOffset;
    });
  };

  private writeUInt8 = (currentByteOffset: number, dataView: DataView, data: number): number => {
    dataView.setUint8(currentByteOffset, data);
    return currentByteOffset + FIELD_TYPES[FIELD_TYPE.UINT_8].bytes;
  };

  private writeUInt16 = (currentByteOffset: number, dataView: DataView, data: number): number => {
    dataView.setUint16(currentByteOffset, data, LITTLE_ENDIAN);
    return currentByteOffset + FIELD_TYPES[FIELD_TYPE.UINT_16].bytes;
  };

  private writeInt32 = (currentByteOffset: number, dataView: DataView, data: number): number => {
    dataView.setInt32(currentByteOffset, data, LITTLE_ENDIAN);
    return currentByteOffset + FIELD_TYPES[FIELD_TYPE.INT_32].bytes;
  };

  private writeFloat32 = (currentByteOffset: number, dataView: DataView, data: number): number => {
    dataView.setFloat32(currentByteOffset, data, LITTLE_ENDIAN);
    return currentByteOffset + FIELD_TYPES[FIELD_TYPE.FLOAT_32].bytes;
  };

  private writeString = (currentByteOffset: number, dataView: DataView, data: string): number => {
    // if (SERVER) return this.serverWriteString(currentByteOffset, dataView, data);
    // return this.clientWriteString(currentByteOffset, dataView, data);

    // apparently node 11 now supports text(de)encoder
    // @ts-ignore
    const uint8array = new TextEncoder("utf-8").encode(data);
    for (let i = 0; i < uint8array.byteLength; i++) {
      dataView.setUint8(currentByteOffset + i, uint8array[i]);
    }
    return currentByteOffset + uint8array.byteLength;
  };

  // private serverWriteString = (
  //   currentByteOffset: number,
  //   dataView: DataView,
  //   data: string
  // ): number => {
  //   const uint8array = Buffer.from(data, "utf8");
  //   for (let i = 0; i < uint8array.byteLength + 1; i++) {
  //     dataView.setUint8(currentByteOffset + i, uint8array[i]);
  //   }
  //   return currentByteOffset + uint8array.byteLength;
  // };

  // private clientWriteString = (
  //   currentByteOffset: number,
  //   dataView: DataView,
  //   data: string
  // ): number => {
  //   // @ts-ignore
  //   const uint8array = new TextEncoder("utf-8").encode(data);
  //   for (let i = 0; i < uint8array.byteLength + 1; i++) {
  //     dataView.setUint8(currentByteOffset + i, uint8array[i]);
  //   }
  //   return currentByteOffset + uint8array.byteLength;
  // };

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
