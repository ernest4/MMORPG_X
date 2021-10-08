import { Buffer } from "buffer";
import Component from "../ecs/Component";
import { EntityId } from "../ecs/types";
import { SERVER } from "../utils/environment";
import SCHEMA, { MESSAGE_TYPE, MESSAGE_TYPES, TYPES } from "./schema";

// NOTE: ArrayBuffer and DataView work on both Node.js & Browser
// NOTE: TextDecoder/TextEncoder for utf-8 strings only work Browser
// NOTE: 'Buffer' from Node.js will be used to do utf-8 encoding/decoding

const MESSAGE_COMPONENT_CLASSES = {
  [MESSAGE_TYPES.PING]: PingMessage,
  // TODO: the rest...
};

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

  parseBinary = (binaryMessage: ArrayBuffer) => {
    const binaryMessageView = new DataView(binaryMessage);
    const messageType = binaryMessageView.getUint8(MESSAGE_TYPE);
    let currentOffset = 1;

    const messageObject = { messageType };
    SCHEMA[messageType].forEach(([fieldName, fieldType]) => {
      const [data, nextOffset] = this._decoders[fieldType](currentOffset, binaryMessageView);
      messageObject[fieldName] = data;
      currentOffset = nextOffset;
    });
    return messageObject;
  };

  binaryToComponent = (
    messageComponentEntityId: EntityId,
    fromEntityId: EntityId,
    binaryMessage: ArrayBuffer
  ): Component => {
    const parsedMessage = this.parseBinary(binaryMessage);
    const messageComponent = new MESSAGE_COMPONENT_CLASSES[parsedMessage.messageType](
      messageComponentEntityId,
      fromEntityId,
      parsedMessage
    );
    return messageComponent;
  };

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
