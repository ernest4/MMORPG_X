export const MESSAGE_TYPES = {
  PING: 0,
  MOVE: 1,
  POSITION: 2,
  ENTER: 3,
  EXIT: 4,
  MAP_INIT: 5,
  // TODO: use this potentially more optimal way to batch initialize all characters
  // CHARACTERS_INIT: 6, // kinda like ENTER + POSITION but for all present characters
};

export const TYPES = {
  INT_32: "Int32",
  FLOAT_32: "Float32",
  STRING: "String",
};

// NOTE: order of fields in each message here matter!!
const SCHEMA = {
  [MESSAGE_TYPES.PING]: [["ping", TYPES.STRING]],
  [MESSAGE_TYPES.POSITION]: [
    ["characterId", TYPES.INT_32],
    ["x", TYPES.FLOAT_32],
    ["y", TYPES.FLOAT_32],
  ],
};

export default SCHEMA;
