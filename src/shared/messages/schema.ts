import Message from "../components/Message";

export const MESSAGE_TYPE_POSITION = 0;
export const LITTLE_ENDIAN = true;

export enum FIELD_TYPE {
  UINT_8,
  UINT_16,
  INT_32,
  FLOAT_32,
  STRING,
  UINT_16_ARRAY,
}

export const UNKNOWN = -1;
export const FIELD_TYPES = {
  [FIELD_TYPE.UINT_8]: { bytes: 1, min: 0, max: 255 },
  [FIELD_TYPE.UINT_16]: { bytes: 2, min: 0, max: 65535 },
  [FIELD_TYPE.INT_32]: { bytes: 4, min: -2147483648, max: 2147483647 },
  [FIELD_TYPE.FLOAT_32]: { bytes: 4, min: -3.40282347e38, max: 3.40282347e38 },
  [FIELD_TYPE.STRING]: { bytes: UNKNOWN, min: UNKNOWN, max: UNKNOWN },
  [FIELD_TYPE.UINT_16_ARRAY]: { bytes: UNKNOWN, min: UNKNOWN, max: UNKNOWN },
} as const;

// export type FIELD_TYPE = keyof typeof FIELD_TYPES;

export type FieldName = string;
export enum BinaryOrder {}
const convertPositionToFieldType = <T>(binaryType: FIELD_TYPE, position: BinaryOrder) =>
  <T>(<unknown>[binaryType, position]);

export enum UInt8 {}
export enum UInt16 {}
export enum Int32 {}
export enum Float32 {}
const u8 = (binaryOrder: BinaryOrder) =>
  convertPositionToFieldType<UInt8>(FIELD_TYPE.UINT_8, binaryOrder);
const u16 = (binaryOrder: BinaryOrder) =>
  convertPositionToFieldType<UInt16>(FIELD_TYPE.UINT_16, binaryOrder);
const i32 = (binaryOrder: BinaryOrder) =>
  convertPositionToFieldType<Int32>(FIELD_TYPE.INT_32, binaryOrder);
const f32 = (binaryOrder: BinaryOrder) =>
  convertPositionToFieldType<Float32>(FIELD_TYPE.FLOAT_32, binaryOrder);
const u16a = (binaryOrder: BinaryOrder) =>
  convertPositionToFieldType<Uint16Array>(FIELD_TYPE.UINT_16_ARRAY, binaryOrder);
const s = (binaryOrder: BinaryOrder) =>
  convertPositionToFieldType<string>(FIELD_TYPE.STRING, binaryOrder);

const entityId = (binaryOrder: BinaryOrder) => ({ entityId: i32(binaryOrder) });

// export const MESSAGE_TYPES = {
//   PING: 0,
//   PONG: 1,
//   POSITION: 2,
//   CHARACTER_CONNECTED: 3,
//   CHARACTER_DISCONNECTED: 4,
//   ROOM_INIT: 5,
//   MOVE: 6,
//   HITPOINTS: 7,
// } as const;

export enum MESSAGE_TYPE {
  PING,
  PONG,
  TRANSFORM,
  CHARACTER,
  NAME,
  TYPE,
  CHARACTER_DISCONNECTED,
  ROOM_INIT,
  MOVE,
  HITPOINTS,
}

// export type MESSAGE_TYPE = typeof MESSAGE_TYPES[keyof typeof MESSAGE_TYPES];

// type ParsedMessage<T extends "CHARACTER_CONNECTED" | "HITPOINTS"> = typeof SCHEMA[typeof MESSAGE_TYPES[T]]["binary"];
// @ts-ignore
export type ParsedMessage<K extends MESSAGE_TYPE> = typeof SCHEMA[K]["parsedMessage"];

// component classes that act as 'tags' for engine to query for
export class PingMessage extends Message<MESSAGE_TYPE.PING> {}
export class PongMessage extends Message<MESSAGE_TYPE.PONG> {}
export class TransformMessage extends Message<MESSAGE_TYPE.TRANSFORM> {}
export class CharacterMessage extends Message<MESSAGE_TYPE.CHARACTER> {}
export class NameMessage extends Message<MESSAGE_TYPE.NAME> {}
export class TypeMessage extends Message<MESSAGE_TYPE.TYPE> {}
export class CharacterDisconnectedMessage extends Message<MESSAGE_TYPE.CHARACTER_DISCONNECTED> {}
export class RoomInitMessage extends Message<MESSAGE_TYPE.ROOM_INIT> {}
export class MoveMessage extends Message<MESSAGE_TYPE.MOVE> {}
export class HitPointsMessage extends Message<MESSAGE_TYPE.HITPOINTS> {}

// export type SchemaItem<T extends MESSAGE_TYPE> = {
//   parsedMessage: ParsedMessage<T>;
//   component: Message<T>;
// };

const parsedMessage = "parsedMessage"; // To prevent typos in schema
const component = "component"; // To prevent typos in schema
const SCHEMA = {
  [MESSAGE_TYPE.PING]: {
    [parsedMessage]: {
      ping: s(0),
    },
    [component]: PingMessage,
  },
  [MESSAGE_TYPE.PONG]: {
    [parsedMessage]: {
      pong: s(0),
    },
    [component]: PongMessage,
  },
  [MESSAGE_TYPE.TRANSFORM]: {
    [parsedMessage]: {
      ...entityId(0),
      x: f32(1),
      y: f32(2),
      z: f32(3),
    },
    [component]: TransformMessage,
  },
  [MESSAGE_TYPE.CHARACTER]: {
    [parsedMessage]: {
      ...entityId(0),
    },
    [component]: CharacterMessage,
  },
  [MESSAGE_TYPE.TYPE]: {
    [parsedMessage]: {
      ...entityId(0),
      type: u8(1),
    },
    [component]: TypeMessage,
  },
  [MESSAGE_TYPE.NAME]: {
    [parsedMessage]: {
      ...entityId(0),
      name: s(1),
    },
    [component]: NameMessage,
  },
  // TODO: probs turns this into more generic REMOVE_COMPONENT with entityId...
  // then if that happens to be a character, client side will know to remove the rest of characters
  // components too
  [MESSAGE_TYPE.CHARACTER_DISCONNECTED]: {
    [parsedMessage]: {
      ...entityId(0),
    },
    [component]: CharacterDisconnectedMessage,
  },
  [MESSAGE_TYPE.ROOM_INIT]: {
    [parsedMessage]: {
      tileSizeInPx: u8(0),
      widthInTiles: u16(1),
      heightInTiles: u16(2),
      tiles: u16a(3),
    },
    [component]: RoomInitMessage,
  },
  [MESSAGE_TYPE.MOVE]: {
    [parsedMessage]: {
      direction: u8(0),
    },
    [component]: MoveMessage,
  },
  [MESSAGE_TYPE.HITPOINTS]: {
    [parsedMessage]: {
      ...entityId(0),
      hitPoints: i32(1),
    },
    [component]: HitPointsMessage,
  },
};

// export type MESSAGE_COMPONENT_CLASSES_INDEX = keyof typeof SCHEMA;

// const c = new CharacterConnected(123, {
//   entityId: 123,
//   characterName: "123",
//   characterType: 123,
// });

// c.parsedMessage.entityId = 5;
// c.parsedMessage;

export default SCHEMA;

export const MESSAGE_COMPONENT_CLASSES_LIST = Object.values(SCHEMA).map(
  ({ component }) => component
);
