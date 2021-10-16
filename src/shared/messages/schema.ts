import Message from "../components/Message";
import Component from "../ecs/Component";

export const MESSAGE_TYPE_POSITION = 0;
export const LITTLE_ENDIAN = true;

export const FIELD_TYPES = {
  UINT_8: { bytes: 1, min: 0, max: 255 },
  UINT_16: { bytes: 2, min: 0, max: 65535 },
  INT_32: { bytes: 4, min: -2147483648, max: 2147483647 },
  FLOAT_32: { bytes: 4, min: -3.40282347e38, max: 3.40282347e38 },
  STRING: {},
  UINT_16_ARRAY: {},
} as const;

export type FIELD_TYPE = keyof typeof FIELD_TYPES;

export type FieldName = string;
export enum BinaryOrder {}
const convertPositionToFieldType = <T>(binaryType: FIELD_TYPE, position: BinaryOrder) =>
  <T>(<unknown>[binaryType, position]);

export enum UInt8 {}
export enum UInt16 {}
export enum Int32 {}
export enum Float32 {}
const u8 = (binaryOrder: BinaryOrder) => convertPositionToFieldType<UInt8>("UINT_8", binaryOrder);
const u16 = (binaryOrder: BinaryOrder) =>
  convertPositionToFieldType<UInt16>("UINT_16", binaryOrder);
const i32 = (binaryOrder: BinaryOrder) => convertPositionToFieldType<Int32>("INT_32", binaryOrder);
const f32 = (binaryOrder: BinaryOrder) =>
  convertPositionToFieldType<Float32>("FLOAT_32", binaryOrder);
const u16a = (binaryOrder: BinaryOrder) =>
  convertPositionToFieldType<Uint16Array>("UINT_16_ARRAY", binaryOrder);
const s = (binaryOrder: BinaryOrder) => convertPositionToFieldType<string>("STRING", binaryOrder);
const characterId = (binaryOrder: BinaryOrder) => ({ characterId: i32(binaryOrder) });

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
  POSITION,
  CHARACTER_CONNECTED,
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
class Ping extends Message<MESSAGE_TYPE.PING> {}
class Pong extends Message<MESSAGE_TYPE.PONG> {}
class Position extends Message<MESSAGE_TYPE.POSITION> {}
class CharacterConnected extends Message<MESSAGE_TYPE.CHARACTER_CONNECTED> {}
class CharacterDisconnected extends Message<MESSAGE_TYPE.CHARACTER_DISCONNECTED> {}
class RoomInit extends Message<MESSAGE_TYPE.ROOM_INIT> {}
class Move extends Message<MESSAGE_TYPE.MOVE> {}
class HitPoints extends Message<MESSAGE_TYPE.HITPOINTS> {}

// export type SchemaItem<T extends MESSAGE_TYPE> = {
//   parsedMessage: ParsedMessage<T>;
//   component: Message<T>;
// };

const SCHEMA = {
  [MESSAGE_TYPE.PING]: {
    parsedMessage: {
      ping: s(0),
    },
    component: Ping,
  },
  [MESSAGE_TYPE.PONG]: {
    parsedMessage: {
      pong: s(0),
    },
    component: Pong,
  },
  [MESSAGE_TYPE.POSITION]: {
    parsedMessage: {
      ...characterId(0),
      x: f32(1),
      y: f32(2),
      z: f32(3),
    },
    component: Position,
  },
  [MESSAGE_TYPE.CHARACTER_CONNECTED]: {
    parsedMessage: {
      ...characterId(0),
      characterType: u8(1),
      characterName: s(2),
    },
    component: CharacterConnected,
  },
  [MESSAGE_TYPE.CHARACTER_DISCONNECTED]: {
    parsedMessage: {
      ...characterId(0),
    },
    component: CharacterDisconnected,
  },
  [MESSAGE_TYPE.ROOM_INIT]: {
    parsedMessage: {
      tileSizeInPx: u8(0),
      widthInTiles: u16(1),
      heightInTiles: u16(2),
      tiles: u16a(3),
    },
    component: RoomInit,
  },
  [MESSAGE_TYPE.MOVE]: {
    parseMessage: {
      direction: u8(0),
    },
    component: Move,
  },
  [MESSAGE_TYPE.HITPOINTS]: {
    parsedMessage: {
      ...characterId(0),
      hitPoints: i32(1),
    },
    component: HitPoints,
  },
};

// export type MESSAGE_COMPONENT_CLASSES_INDEX = keyof typeof SCHEMA;

// const c = new CharacterConnected(123, {
//   characterId: 123,
//   characterName: "123",
//   characterType: 123,
// });

// c.parsedMessage.characterId = 5;
// c.parsedMessage;

export default SCHEMA;

export const MESSAGE_COMPONENT_CLASSES_LIST = Object.values(SCHEMA).map(
  ({ component }) => component
);

// export const MAPPiNG = {
//   Ping,
//   Pong,
// };

// export const MESSAGE_COMPONENT_CLASSES_INDEX = MESSAGE_COMPONENT_CLASSES_LIST.reduce((map, obj) => {
//   map[obj.name] = obj;
//   return map;
// }, {});
