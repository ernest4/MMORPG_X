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
  // FOR TESTING ===>
  TEST_I32,
  TEST_SEQUENCE,
  TEST_NUMBER_TYPES,
  TEST_STRING,
  TEST_NUMBER_AND_STRING,
  TEST_U16_ARRAY,
  TEST_NUMBER_AND_U16_ARRAY,
  // FOR TESTING <===
  PING,
  PONG,
  TRANSFORM,
  CHARACTER,
  NAME,
  HUNTER,
  DRIFTER,
  HACKER,
  CHARACTER_DISCONNECTED,
  ROOM_INIT,
  MOVE,
  HITPOINTS,
}

// export type MESSAGE_TYPE = typeof MESSAGE_TYPES[keyof typeof MESSAGE_TYPES];

// type ParsedMessage<T extends "CHARACTER_CONNECTED" | "HITPOINTS"> = typeof SCHEMA[typeof MESSAGE_TYPES[T]]["binary"];
export type ParsedMessage<K extends MESSAGE_TYPE> = {
  messageType: K;
} & typeof SCHEMA[K]["parsedMessage"];

// export type ParsedMessage<K extends MESSAGE_TYPE> = {
//   messageType: K;
//   typeof SCHEMA[K]["parsedMessage"];
// }

// component classes that act as 'tags' for engine to query for
// FOR TESTING ===>
export class TestI32Message extends Message<MESSAGE_TYPE.TEST_I32> {}
export class TestNumbersSequenceMessage extends Message<MESSAGE_TYPE.TEST_SEQUENCE> {}
export class TestNumberTypesMessage extends Message<MESSAGE_TYPE.TEST_NUMBER_TYPES> {}
export class TestStringMessage extends Message<MESSAGE_TYPE.TEST_STRING> {}
export class TestNumberAndStringMessage extends Message<MESSAGE_TYPE.TEST_NUMBER_AND_STRING> {}
export class TestU16ArrayMessage extends Message<MESSAGE_TYPE.TEST_U16_ARRAY> {}
export class TestNumberAndU16ArrayMessage extends Message<MESSAGE_TYPE.TEST_NUMBER_AND_U16_ARRAY> {}
// FOR TESTING <===
export class PingMessage extends Message<MESSAGE_TYPE.PING> {}
export class PongMessage extends Message<MESSAGE_TYPE.PONG> {}
export class TransformMessage extends Message<MESSAGE_TYPE.TRANSFORM> {}
export class CharacterMessage extends Message<MESSAGE_TYPE.CHARACTER> {}
export class NameMessage extends Message<MESSAGE_TYPE.NAME> {}
export class HunterMessage extends Message<MESSAGE_TYPE.HUNTER> {}
export class DrifterMessage extends Message<MESSAGE_TYPE.DRIFTER> {}
export class HackerMessage extends Message<MESSAGE_TYPE.HACKER> {}
export class CharacterDisconnectedMessage extends Message<MESSAGE_TYPE.CHARACTER_DISCONNECTED> {}
export class RoomInitMessage extends Message<MESSAGE_TYPE.ROOM_INIT> {}
export class MoveMessage extends Message<MESSAGE_TYPE.MOVE> {}
export class HitPointsMessage extends Message<MESSAGE_TYPE.HITPOINTS> {}

export type SchemaItem<T extends MESSAGE_TYPE> = {
  parsedMessage: ParsedMessage<T>;
  component: Message<T>;
};

export type Schema = { [key in MESSAGE_TYPE]: SchemaItem<MESSAGE_TYPE> };

const parsedMessage = "parsedMessage"; // To prevent typos in schema
const component = "component"; // To prevent typos in schema
const SCHEMA = {
  // FOR TESTING ===>
  [MESSAGE_TYPE.TEST_I32]: {
    [parsedMessage]: {
      testNumber: i32(0),
    },
    [component]: TestI32Message,
  },
  [MESSAGE_TYPE.TEST_SEQUENCE]: {
    [parsedMessage]: {
      testUInt8_0: u8(0),
      testUInt8_1: u8(1),
      testUInt8_2: u8(2),
      testUInt8_3: u8(3),
      testUInt8_4: u8(4),
    },
    [component]: TestNumbersSequenceMessage,
  },
  [MESSAGE_TYPE.TEST_NUMBER_TYPES]: {
    [parsedMessage]: {
      testUInt8_0: u8(0),
      testUInt16_1: u16(1),
      testInt32_2: i32(2),
      testFloat32_3: f32(3),
    },
    [component]: TestNumberTypesMessage,
  },
  [MESSAGE_TYPE.TEST_STRING]: {
    [parsedMessage]: {
      testString: s(0),
    },
    [component]: TestStringMessage,
  },
  [MESSAGE_TYPE.TEST_NUMBER_AND_STRING]: {
    [parsedMessage]: {
      testUInt16_0: u16(0),
      testString_1: s(1),
    },
    [component]: TestNumberAndStringMessage,
  },
  [MESSAGE_TYPE.TEST_U16_ARRAY]: {
    [parsedMessage]: {
      testU16Array: u16a(0),
    },
    [component]: TestU16ArrayMessage,
  },
  [MESSAGE_TYPE.TEST_NUMBER_AND_U16_ARRAY]: {
    [parsedMessage]: {
      testInt32_0: i32(0),
      testU16Array_1: u16a(1),
    },
    [component]: TestNumberAndU16ArrayMessage,
  },
  // FOR TESTING <===
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
  [MESSAGE_TYPE.HUNTER]: {
    [parsedMessage]: {
      ...entityId(0),
    },
    [component]: HunterMessage,
  },
  [MESSAGE_TYPE.DRIFTER]: {
    [parsedMessage]: {
      ...entityId(0),
    },
    [component]: DrifterMessage,
  },
  [MESSAGE_TYPE.HACKER]: {
    [parsedMessage]: {
      ...entityId(0),
    },
    [component]: HackerMessage,
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
