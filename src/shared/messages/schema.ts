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
  INT_32: 'Int32',
  FLOAT_32: 'Float32'
}

const SCHEMA = {
  [MESSAGE_TYPES.PING]: { messageType, ping },
  [MESSAGE_TYPES.POSITION]: { messageType, characterId, x, y },

  // [MESSAGE_TYPES.POSITION]: [
  //   {field: 'characterId', type: 'Int32', position: 1},
  //   {field: 'x', type: 'Float32', position: 5},
  //   {field: 'y', type: 'Float32', position: 9}
  // ],
  // NOTE: order of fields here matter!!
  [MESSAGE_TYPES.POSITION]: [
    ['characterId', TYPES.INT_32],
    ['x', TYPES.FLOAT_32],
    ['y', TYPES.FLOAT_32]
  ],
};

export default SCHEMA;


case MESSAGE_TYPE.PING: {
  // [type,string]

  const decoder = new TextDecoder("utf-8");
  const textSlice = data.slice(1, data.byteLength);
  const ping = decoder.decode(textSlice);

  // TODO: add the image / texture info for character appearance (send key)
  const message_object = { messageType, ping };

  console.log(message_object);

  return message_object;
}
case: {
}