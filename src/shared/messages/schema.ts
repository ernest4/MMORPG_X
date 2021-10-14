import CharacterConnected from "../components/message/CharacterConnected";
import CharacterDisconnected from "../components/message/CharacterDisconnected";
import MapInit from "../components/message/MapInit";
import Move from "../components/message/Move";
import Ping from "../components/message/Ping";
import Pong from "../components/message/Pong";
import Position from "../components/message/Position";
import HitPoints from "../components/message/HitPoints";
import { Vector3Hash } from "../ecs/utils/Vector3BufferView";
import { EntityId } from "../ecs/types";
import Component from "../ecs/Component";

export const MESSAGE_TYPE = 0;
export const LITTLE_ENDIAN = true;

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

export const FIELD_TYPES = {
  UINT_8: "UInt8",
  UINT_16: "UInt16",
  INT_32: "Int32",
  FLOAT_32: "Float32",
  STRING: "String",
  UINT_16_ARRAY: "UInt16Array",
} as const;

export type FIELD_TYPE = typeof FIELD_TYPES[keyof typeof FIELD_TYPES];

export const FIELD_TYPE_BYTES = {
  [FIELD_TYPES.UINT_8]: 1,
  [FIELD_TYPES.UINT_16]: 2,
  [FIELD_TYPES.INT_32]: 4,
  [FIELD_TYPES.FLOAT_32]: 4,
  // [FIELD_TYPES.STRING] // unknown in advance
  // [FIELD_TYPES.UINT_16_ARRAY] // unknown in advance
} as const;

export const FIELD_TYPE_RANGES = {
  [FIELD_TYPES.UINT_8]: { min: 0, max: 255 },
  [FIELD_TYPES.UINT_16]: { min: 0, max: 65535 },
  [FIELD_TYPES.INT_32]: { min: -2147483648, max: 2147483647 },
  [FIELD_TYPES.FLOAT_32]: { min: -3.40282347e38, max: 3.40282347e38 },
  // [FIELD_TYPES.STRING] // unknown in advance
  // [FIELD_TYPES.UINT_16_ARRAY] // unknown in advance
} as const;

// NOTE: order of fields in each message here matter!!
// NOTE: strings and arrays should come last as their size is unknown in advance
const SCHEMA = {
  [MESSAGE_TYPES.PING]: {
    binary: [["ping", FIELD_TYPES.STRING]],
    component: Ping,
  },
  [MESSAGE_TYPES.PONG]: {
    binary: [["pong", FIELD_TYPES.STRING]],
    component: Pong,
  },
  [MESSAGE_TYPES.CHARACTER_CONNECTED]: {
    binary: [
      ["characterId", FIELD_TYPES.INT_32],
      ["characterName", FIELD_TYPES.STRING],
      ["type", FIELD_TYPES.UINT_8],
    ],
    component: CharacterConnected,
  },
  [MESSAGE_TYPES.HITPOINTS]: {
    binary: [
      ["characterId", FIELD_TYPES.INT_32],
      ["hitpoints", FIELD_TYPES.INT_32],
    ],
    component: HitPoints,
  },
  [MESSAGE_TYPES.CHARACTER_DISCONNECTED]: {
    binary: [["characterId", FIELD_TYPES.STRING]],
    component: CharacterDisconnected,
  },
  [MESSAGE_TYPES.ROOM_INIT]: {
    binary: [
      ["tileSizeInPx", FIELD_TYPES.UINT_8],
      ["widthInTiles", FIELD_TYPES.UINT_16],
      ["heightInTiles", FIELD_TYPES.UINT_16],
      ["tiles", FIELD_TYPES.UINT_16_ARRAY],
    ],
    component: MapInit,
  },
  [MESSAGE_TYPES.MOVE]: {
    binary: [["direction", FIELD_TYPES.UINT_8]],
    component: Move,
  },
  [MESSAGE_TYPES.POSITION]: {
    binary: [
      ["characterId", FIELD_TYPES.INT_32],
      ["x", FIELD_TYPES.FLOAT_32],
      ["y", FIELD_TYPES.FLOAT_32],
      ["z", FIELD_TYPES.FLOAT_32],
    ],
    component: Position,
  },
} as const;

const typeName = "number";
const typeName2 = "boolean";
const typeName3 = "string";

type StringToType<T> = T extends "number"
  ? number
  : T extends "boolean"
  ? boolean
  : T extends "string"
  ? string
  : never;
type myNumberType = StringToType<typeof typeName>;
type myBooleanType = StringToType<typeof typeName2>;
type myStringType = StringToType<typeof typeName3>;

const x: myNumberType = 5;
const y: myBooleanType = true;
const z: myStringType = "5";

type testy = typeof CharacterConnected.binary[number];
// type values = testy[number][2];
// type obj = {[key in testy[0]]: any}
type obj = { [key in testy[0]]: StringToType<typeof testy[number][2]> };

// type parsedMessage = { [key in typeof CharacterConnected.binary[number][0]]: any };
// TODO: this ?

type UInt8 = number;

// const int32 = (string: string) => `${string}_Int32`;
class CharacterConnected extends Component {
  // parsedMessage: { thing: UInt8 };
  // characterId: string;
  parsedMessage: typeof CharacterConnected.binary;

  // constructor(entityId, [characterId, characterName, type]: [EntityId, string, number]) {
  constructor(entityId, parsedMessage: typeof CharacterConnected.binary) {
    // constructor(entityId, parsedMessage: { thing: UInt8 }) {
    super(entityId);
    // this.characterId = params.characterId as string;
    // this._id = id;
    // this._name = name;
    // this._hitpoints = hitpoints;
    // this._x = x;
    // this._y = y;
    // this._z = z;
    // CharacterConnected.wowser["123"];
    // Object.entries(params).forEach(([field, value]) => {
    //   this[field] = value;
    // });
    this.parsedMessage = parsedMessage;
  }

  // static binary = [
  //   ["characterId", FIELD_TYPES.INT_32, "number"] as const,
  //   ["characterName", FIELD_TYPES.STRING, "string"] as const,
  //   ["type", FIELD_TYPES.UINT_8, "number"] as const,
  // ] as const;

  static binary = {
    characterId_Int32: <BinaryTypeToTypeScriptType<typeof FIELD_TYPES.INT_32>>(
      (<any>[FIELD_TYPES.INT_32, 0])
    ),
    characterName: <string>(<unknown>[FIELD_TYPES.STRING, 1]),
    type: (<unknown>[FIELD_TYPES.UINT_8, 2]) as BinaryTypeToTypeScriptType<
      typeof FIELD_TYPES.UINT_8
    >,
    something: <number>(<unknown>{ binaryType: FIELD_TYPES.UINT_8, position: 2 }),
  };

  // static test = () => {
  //   this.name
  // }

  // parseBinary = (binaryMessage: ArrayBuffer) => {
  //   //
  // };

  // toBinary = (): ArrayBuffer => {
  //   //
  // };
}

const fieldType = CharacterConnected.binary.characterId[0];
const fieldCardinality = CharacterConnected.binary.characterId[1];

const testy = new CharacterConnected(123, { characterId: 123, characterName: "wowser", type: 123 });
// const testy = new CharacterConnected(123, {});

// const testy = new CharacterConnected(123, ["abcc", 123, { x: 1, y: 2, z: 3 }]);

export default SCHEMA;

export const MESSAGE_COMPONENT_CLASSES = Object.values(SCHEMA).map(({ component }) => component);

// type BinaryTypeToTypeScriptType<T> = T extends typeof FIELD_TYPES.INT_32
//   ? number
//   : T extends typeof FIELD_TYPES.UINT_8
//   ? number
//   : T extends typeof FIELD_TYPES.STRING
//   ? string
//   : never;

// type keys = typeof binary[number]['field']
// type values = BinaryTypeToTypeScriptType<typeof binary[number]['binaryType']>

// type parsedMessage = {[key in typeof binary[number]['field']]: typeof binary[number]['binaryType']}

// const binary = [
//   { field: 'characterId', binaryType: FIELD_TYPES.INT_32 },
//   { field: 'characterName', binaryType: FIELD_TYPES.STRING },
//   { field: 'type', binaryType: FIELD_TYPES.UINT_8 }
// ] as const

type BinaryTypeToTypeScriptType<T> = T extends typeof FIELD_TYPES.INT_32
  ? number
  : T extends typeof FIELD_TYPES.UINT_8
  ? number
  : T extends typeof FIELD_TYPES.STRING
  ? string
  : never;

// type keys = keyof typeof binary;
// // type values = BinaryTypeToTypeScriptType<typeof binary[number]["binaryType"]>;

// type parsedMessage = {
//   [key in keyof typeof binary]: typeof binary[keyof typeof binary][0];
// };

// // what a hack :D
// const binary = {
//   characterId: (<unknown>[FIELD_TYPES.INT_32, 0]) as BinaryTypeToTypeScriptType<
//     typeof FIELD_TYPES.INT_32
//   >,
//   characterName: (<unknown>[FIELD_TYPES.STRING, 1]) as BinaryTypeToTypeScriptType<
//     typeof FIELD_TYPES.STRING
//   >,
//   type: (<unknown>[FIELD_TYPES.UINT_8, 2]) as BinaryTypeToTypeScriptType<typeof FIELD_TYPES.UINT_8>,
// };

// type b = typeof binary;
