import Enter from "../components/message/Enter";
import Exit from "../components/message/Exit";
import MapInit from "../components/message/MapInit";
import Move from "../components/message/Move";
import Ping from "../components/message/Ping";
import Pong from "../components/message/Pong";
import Position from "../components/message/Position";

export const MESSAGE_TYPE = 0;
export const LITTLE_ENDIAN = true;

const MESSAGE_TYPES = {
  PING: 0,
  PONG: 1,
  POSITION: 2,
  CHARACTER_CONNECTED: 3,
  CHARACTER_DISCONNECTED: 4,
  MAP_INIT: 5,
  MOVE: 6,
  // TODO: use this potentially more optimal way to batch initialize all characters
  // CHARACTERS_INIT: 6, // kinda like ENTER + POSITION but for all present characters
};

export const FIELD_TYPES = {
  UINT_8: "UInt8",
  UINT_16: "UInt16",
  INT_32: "Int32",
  FLOAT_32: "Float32",
  STRING: "String",
  UINT_16_ARRAY: "UInt16Array",
};

// NOTE: order of fields in each message here matter!!
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
    ],
    component: Enter,
  },
  [MESSAGE_TYPES.CHARACTER_DISCONNECTED]: {
    binary: [["characterId", FIELD_TYPES.STRING]],
    component: Exit,
  },
  [MESSAGE_TYPES.MAP_INIT]: {
    binary: [
      ["tileSize", FIELD_TYPES.UINT_8],
      ["mapWidth", FIELD_TYPES.UINT_16],
      ["mapHeight", FIELD_TYPES.UINT_16],
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
    ],
    component: Position,
  },
};

export default SCHEMA;

export const MESSAGE_COMPONENT_CLASSES = Object.values(SCHEMA).map(({ component }) => component);
