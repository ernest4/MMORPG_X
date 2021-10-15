// import CharacterDisconnected from "../components/message/CharacterDisconnected";
import MapInit from "../components/message/MapInit";
import Move from "../components/message/Move";
// import Ping from "../components/message/Ping";
// import Pong from "../components/message/Pong";
import Position from "../components/message/Position";
// import HitPoints from "../components/message/HitPoints";
import { Vector3Hash } from "../ecs/utils/Vector3BufferView";
import { ComponentClass, EntityId } from "../ecs/types";
import Component from "../ecs/Component";
import Message from "../components/Message";

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

enum Int32 {}
enum UInt8 {}
const i32 = (binaryOrder: BinaryOrder) => convertPositionToFieldType<Int32>("INT_32", binaryOrder);
const u8 = (binaryOrder: BinaryOrder) => convertPositionToFieldType<UInt8>("UINT_8", binaryOrder);
const s = (binaryOrder: BinaryOrder) => convertPositionToFieldType<string>("STRING", binaryOrder);

export const MESSAGE_TYPES = {
  PING: 0,
  PONG: 1,
  POSITION: 2,
  CHARACTER_CONNECTED: 3,
  CHARACTER_DISCONNECTED: 4,
  ROOM_INIT: 5,
  MOVE: 6,
  HITPOINTS: 7,
} as const;

export type MESSAGE_TYPE = typeof MESSAGE_TYPES[keyof typeof MESSAGE_TYPES];

// type ParsedMessage<T extends "CHARACTER_CONNECTED" | "HITPOINTS"> = typeof SCHEMA[typeof MESSAGE_TYPES[T]]["binary"];
// @ts-ignore
export type ParsedMessage<K extends MESSAGE_TYPE> = typeof SCHEMA[K]["parsedMessage"];

class Ping extends Message<typeof MESSAGE_TYPES.PING> {}
class Pong extends Message<typeof MESSAGE_TYPES.PONG> {}
class CharacterConnected extends Message<typeof MESSAGE_TYPES.CHARACTER_CONNECTED> {}
class CharacterDisconnected extends Message<typeof MESSAGE_TYPES.CHARACTER_DISCONNECTED> {}
class HitPoints extends Message<typeof MESSAGE_TYPES.HITPOINTS> {}

const SCHEMA = {
  [MESSAGE_TYPES.PING]: {
    parsedMessage: {
      ping: s(0),
    },
    component: Ping,
  },
  [MESSAGE_TYPES.PONG]: {
    parsedMessage: {
      pong: s(0),
    },
    component: Pong,
  },
  [MESSAGE_TYPES.CHARACTER_CONNECTED]: {
    parsedMessage: {
      characterId: i32(0),
      characterType: u8(1),
      characterName: s(2),
    },
    component: CharacterConnected,
  },
  [MESSAGE_TYPES.HITPOINTS]: {
    parsedMessage: {
      characterId: i32(0),
      hitpoints: i32(1),
    },
    component: HitPoints,
  },
  [MESSAGE_TYPES.CHARACTER_DISCONNECTED]: {
    parsedMessage: {
      characterId: i32(0),
    },
    component: CharacterDisconnected,
  },
  // [MESSAGE_TYPES.ROOM_INIT]: {
  //   binary: [
  //     ["tileSizeInPx", FIELD_TYPE.UINT_8],
  //     ["widthInTiles", FIELD_TYPE.UINT_16],
  //     ["heightInTiles", FIELD_TYPE.UINT_16],
  //     ["tiles", FIELD_TYPE.UINT_16_ARRAY],
  //   ],
  //   component: MapInit,
  // },
  // [MESSAGE_TYPES.MOVE]: {
  //   binary: [["direction", FIELD_TYPE.UINT_8]],
  //   component: Move,
  // },
  // [MESSAGE_TYPES.POSITION]: {
  //   binary: [
  //     ["characterId", FIELD_TYPE.INT_32],
  //     ["x", FIELD_TYPE.FLOAT_32],
  //     ["y", FIELD_TYPE.FLOAT_32],
  //     ["z", FIELD_TYPE.FLOAT_32],
  //   ],
  //   component: Position,
  // },
  // };
  // } as const;
};

// const c = new CharacterConnected(123, {
//   characterId: 123,
//   characterName: "123",
//   characterType: 123,
// });

// c.parsedMessage.characterId = 5;
// c.parsedMessage;

export default SCHEMA;

export const MESSAGE_COMPONENT_CLASSES = Object.values(SCHEMA).map(({ component }) => component);

// type BinaryTypeToTypeScriptType<T> = T extends typeof FIELD_TYPE.INT_32
//   ? number
//   : T extends typeof FIELD_TYPE.UINT_8
//   ? number
//   : T extends typeof FIELD_TYPE.STRING
//   ? string
//   : never;

// type keys = typeof binary[number]['field']
// // type values = BinaryTypeToTypeScriptType<typeof binary[number]['binaryType']>

// const arr = [
//   { key: "foo", val: "bar" },
//   { key: "hello", val: "world" },
// ];

// const result = arr.reduce(function (map, obj) {
//   map[obj.key] = obj.val;
//   return map;
// }, {});

// type t2 = typeof result;

// type parsedMessage = {
//   [key in typeof binary[number]["field"]]: typeof binary[number]["binaryType"];
// };

// const binary = [
//   { field: "characterId", binaryType: FIELD_TYPE.INT_32 },
//   { field: "characterName", binaryType: FIELD_TYPE.STRING },
//   { field: "type", binaryType: FIELD_TYPE.UINT_8 },
// ] as const;

// type parsedMessage = { [key in typeof binary[number][0]]: typeof binary[number][1] };

// const binary = [
//   ["characterId", FIELD_TYPE.INT_32],
//   ["type", FIELD_TYPE.UINT_8],
//   ["characterName", FIELD_TYPE.STRING],
// ] as const;

// type BinaryTypeToTypeScriptType<T> = T extends typeof FIELD_TYPE.INT_32
//   ? number
//   : T extends typeof FIELD_TYPE.UINT_8
//   ? number
//   : T extends typeof FIELD_TYPE.STRING
//   ? string
//   : never;

// type keys = keyof typeof binary;
// // type values = BinaryTypeToTypeScriptType<typeof binary[number]["binaryType"]>;

// type parsedMessage = {
//   [key in keyof typeof binary]: typeof binary[keyof typeof binary][0];
// };

// // what a hack :D
// const binary = {
//   characterId: (<unknown>[FIELD_TYPE.INT_32, 0]) as BinaryTypeToTypeScriptType<
//     typeof FIELD_TYPE.INT_32
//   >,
//   characterName: (<unknown>[FIELD_TYPE.STRING, 1]) as BinaryTypeToTypeScriptType<
//     typeof FIELD_TYPE.STRING
//   >,
//   type: (<unknown>[FIELD_TYPE.UINT_8, 2]) as BinaryTypeToTypeScriptType<typeof FIELD_TYPE.UINT_8>,
// };

// type b = typeof binary;
