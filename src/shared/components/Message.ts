import Component from "../ecs/Component";
import { EntityId } from "../../shared/ecs/types";
import SCHEMA, { MESSAGE_TYPES } from "../messages/schema";

// type ParsedMessageType<T extends "CHARACTER_CONNECTED" | "HITPOINTS"> = typeof SCHEMA[typeof MESSAGE_TYPES[T]]["binary"];

type ParsedMessageType<T extends "CHARACTER_CONNECTED" | "HITPOINTS"> = typeof SCHEMA[typeof MESSAGE_TYPES[T]]["binary"];

class Message<T extends "CHARACTER_CONNECTED" | "HITPOINTS"> extends Component {
// class Message<T extends MESSAGE_TYPES> extends Component {
  parsedMessage: ParsedMessageType<T>
  from?: EntityId;

  constructor(entityId: EntityId, parsedMessage: ParsedMessageType<T>, from?: EntityId) {
    super(entityId);
    this.parsedMessage = parsedMessage;
    this.from = from;
  }
}

// TODO: optimize with ArrayBuffers ??
// class Message<T> extends Component {
//   parsedMessage: T; // hash...
//   from?: EntityId;

//   constructor(entityId: EntityId, parsedMessage: T, from?: EntityId) {
//     super(entityId);
//     this.parsedMessage = parsedMessage;
//     this.from = from;
//   }
// }

export default Message;
