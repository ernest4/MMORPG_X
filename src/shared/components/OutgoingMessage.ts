import Component from "../ecs/Component";
import { EntityId } from "../ecs/types";
import { MESSAGE_TYPE, ParsedMessage } from "../messages/schema";

class OutgoingMessage<T extends MESSAGE_TYPE> extends Component {
  messageType: T;
  parsedMessage: ParsedMessage<T>;
  recipient?: EntityId;

  constructor(
    entityId: EntityId,
    messageType: T,
    parsedMessage: ParsedMessage<T>,
    recipient?: EntityId
  ) {
    super(entityId);
    this.messageType = messageType;
    this.parsedMessage = parsedMessage;
    this.recipient = recipient;
  }
}

export default OutgoingMessage;
