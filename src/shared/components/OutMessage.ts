import Component from "../ecs/Component";
import { EntityId } from "../ecs/types";
import { MESSAGE_TYPE, ParsedMessage } from "../messages/schema";

class OutMessage<T extends MESSAGE_TYPE> extends Component {
  parsedMessage: ParsedMessage<T>;
  recipient?: EntityId;

  constructor(entityId: EntityId, parsedMessage: ParsedMessage<T>, recipient?: EntityId) {
    super(entityId);
    this.parsedMessage = parsedMessage;
    this.recipient = recipient;
  }
}

export default OutMessage;
