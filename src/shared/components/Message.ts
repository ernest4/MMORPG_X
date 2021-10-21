import Component from "../ecs/Component";
import { EntityId } from "../ecs/types";
import { isNumber } from "../ecs/utils/Number";
import { MESSAGE_TYPE, ParsedMessage } from "../messages/schema";
import Event from "./interfaces/Event";

class Message<T extends MESSAGE_TYPE> extends Component implements Event {
  parsedMessage: ParsedMessage<T>;
  sender?: EntityId;

  constructor(entityId: EntityId, parsedMessage: ParsedMessage<T>, sender?: EntityId) {
    super(entityId);
    this.parsedMessage = parsedMessage;
    this.sender = sender;
  }

  get targetEntityId(): EntityId {
    // NOTE: kinda hacky...but i think it works
    // this.sender covers client -> server messages
    // this.parsedMessage["entityId"] covers server -> client messages
    return isNumber(this.sender) ? this.sender : this.parsedMessage["entityId"];
  }
}

export default Message;
