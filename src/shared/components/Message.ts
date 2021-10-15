import Component from "../ecs/Component";
import { EntityId } from "../ecs/types";
import { MESSAGE_TYPE, ParsedMessage } from "../messages/schema";

class Message<T extends MESSAGE_TYPE> extends Component {
  parsedMessage: ParsedMessage<T>;
  sender?: EntityId;

  constructor(entityId: EntityId, parsedMessage: ParsedMessage<T>, sender?: EntityId) {
    super(entityId);
    this.parsedMessage = parsedMessage;
    this.sender = sender;
  }
}

export default Message;
