export const MESSAGE_TYPE = 0;

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



case MESSAGE_TYPE.ENTER: {
  // [type,id,id,id,id,name,name,name,...]

  const characterId = view.getInt32(1, true);

  const decoder = new TextDecoder("utf-8");
  const textSlice = data.slice(5, data.byteLength);
  const name = decoder.decode(textSlice);

  // TODO: add the image / texture info for character appearance (send key)
  const message_object = { messageType, characterId, name };

  console.log(message_object);

  return message_object;
}
case MESSAGE_TYPE.EXIT: {
  const characterId = view.getInt32(1, true);

  const message_object = { messageType, characterId };

  console.log(message_object);

  return message_object;
}
// TODO: use this potentially more optimal way to batch initialize all characters
// case MESSAGE_TYPE.CHARACTERS_INIT: {
//   console.log("CHARACTERS_INIT");
//   const characters = [];

//   characters.push({ characterId, name });

//   return { messageType, characters };
// }
case MESSAGE_TYPE.MAP_INIT: {
  // [type,tileSize,width,width,height,height,tile,tile,tile,...]
  console.log("map init");

  // TODO: some automatic way to track and return byte offset?? maybe if this was a class and we
  // had a method for each get... that would track it's own byte count and post that to class...
  const tileSize = view.getUint8(1);
  const mapWidth = view.getUint16(2, true);
  const mapHeight = view.getUint16(4, true);

  // couuuuld extract the tiles into plain array but...
  // const tiles = [];
  // for (let tile = 0; tile < width * height; tile++) {
  //   tiles.push(view.getUint16(5 + tile * 2, true));
  // }
  // might be more efficient to keep the tile info in the buffer where we can take advantage of
  // cache locality !!! lets try go with that...
  const tile_bytes = 2;
  const tiles_array_buffer = data.slice(6, mapWidth * mapHeight * tile_bytes); // raw ArrayBuffer
  const tiles = new Int16Array(tiles_array_buffer); // can loop over Int16Array with forEach()

  const message_object = { messageType, tileSize, mapWidth, mapHeight, tiles };

  console.log(message_object);

  return message_object;
}
default: {
  console.log("Unrecognised message type received");
  return { error: "Unrecognised message type received" };
}
}
};

export const serialize = (message: any) => {
switch (message.messageType) {
case MESSAGE_TYPE.MOVE: {
  const buffer = new ArrayBuffer(2);
  const view = new DataView(buffer);

  view.setUint8(0, MESSAGE_TYPE.MOVE);
  view.setUint8(1, message.direction);

  console.warn("move buffer");
  console.log(buffer);

  return buffer;
}
default: {
  console.log("Unrecognised message type received");
  return { error: "Unrecognised message type received" };
}