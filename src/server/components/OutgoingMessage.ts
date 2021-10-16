import Component from "../../shared/ecs/Component";
import { EntityId } from "../../shared/ecs/types";
import { MESSAGE_TYPE, ParsedMessage } from "../../shared/messages/schema";

class OutgoingMessage<T extends MESSAGE_TYPE> extends Component {
  messageType: T;
  parsedMessage: ParsedMessage<T>;
  recipient: EntityId;

  constructor(
    entityId: EntityId,
    messageType: T,
    parsedMessage: ParsedMessage<T>,
    recipient: EntityId
  ) {
    super(entityId);
    this.messageType = messageType;
    this.parsedMessage = parsedMessage;
    this.recipient = recipient;
  }
}

export default OutgoingMessage;
