import { EntityId } from "../../ecs/types";
import SCHEMA, { MESSAGE_TYPES } from "../../messages/schema";
import Message from "../Message";

// maybe this way? but how will reader/writer distinguis this per message?
// import all messages? index of mmessages?
// export const PARSED_MESSAGE = {
//   characterId_u32: <number>(<any>0),
//   type_u8: <number>(<any>1),
//   characterName_s: <string>(<any>2),
// };

// type ParsedMessageType<T extends "CHARACTER_CONNECTED" | "HITPOINTS"> = typeof SCHEMA[typeof MESSAGE_TYPES[T]]["binary"];

// type thingy = typeof SCHEMA[typeof MESSAGE_TYPES["CHARACTER_CONNECTED"]]["binary"];
// type thingy2 = ParsedMessageType<"CHARACTER_CONNECTED">

class CharacterConnected extends Message<"CHARACTER_CONNECTED"> {
// class CharacterConnected extends Message<
//   typeof SCHEMA[typeof MESSAGE_TYPES["CHARACTER_CONNECTED"]]["binary"]
// > {
  // class CharacterConnected extends Message<typeof PARSED_MESSAGE> {
  // parsedMessage: typeof PARSED_MESSAGE;
  // constructor(entityId: EntityId, parsedMessage: typeof PARSED_MESSAGE, from?: EntityId) {
  // constructor(entityId: EntityId, parsedMessage: typeof PARSED_MESSAGE, from?: EntityId) {
  //   super(entityId, parsedMessage, from);
  //   this.parsedMessage = parsedMessage;
  // }
}
// TODO: optimize with ArrayBuffers ??
// class CharacterConnected extends Message {
//   parsedMessage: typeof CharacterConnected.binary;

//   constructor(
//     entityId: EntityId,
//     parsedMessage: typeof CharacterConnected.binary,
//     from?: EntityId
//   ) {
//     super(entityId, parsedMessage, from);
//     this.parsedMessage = parsedMessage;
//   }

//   // static binary = [
//   //   ["characterId", FIELD_TYPES.INT_32, "number"] as const,
//   //   ["characterName", FIELD_TYPES.STRING, "string"] as const,
//   //   ["type", FIELD_TYPES.UINT_8, "number"] as const,
//   // ] as const;

//   static binary = {
//     characterId_u32: <number>(<any>0),
//     type_u8: <number>(<any>1),
//     characterName_s: <string>(<any>2),
//   };
// }

export default CharacterConnected;
