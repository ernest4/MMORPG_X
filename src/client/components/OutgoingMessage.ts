import Component from "../../shared/ecs/Component";
import { EntityId } from "../../shared/ecs/types";
import { MESSAGE_TYPE, ParsedMessage } from "../../shared/messages/schema";

class OutgoingMessage<T extends MESSAGE_TYPE> extends Component {
  messageType: MESSAGE_TYPE;
  parsedMessage: ParsedMessage<T>;

  constructor(entityId: EntityId, messageType: T, parsedMessage: ParsedMessage<T>) {
    super(entityId);
    this.messageType = messageType;
    this.parsedMessage = parsedMessage;
  }
}

export default OutgoingMessage;
