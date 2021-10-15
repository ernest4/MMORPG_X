import Component from "../../ecs/Component";
import { EntityId } from "../../ecs/types";
import SCHEMA, { MESSAGE_TYPE } from "../schema";

// type ParsedMessage<T extends "CHARACTER_CONNECTED" | "HITPOINTS"> = typeof SCHEMA[typeof MESSAGE_TYPES[T]]["binary"];

// @ts-ignore
type ParsedMessage<K extends MESSAGE_TYPE> = typeof SCHEMA[K]["parsedMessage"];

class Message<T extends MESSAGE_TYPE> extends Component {
  parsedMessage: ParsedMessage<T>;
  from?: EntityId;

  constructor(entityId: EntityId, parsedMessage: ParsedMessage<T>, from?: EntityId) {
    super(entityId);
    this.parsedMessage = parsedMessage;
    this.from = from;
  }
}

export default Message;
