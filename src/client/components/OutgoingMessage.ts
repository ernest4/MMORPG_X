import Component from "../../shared/ecs/Component";
import { EntityId } from "../../shared/ecs/types";
import { MESSAGE_TYPE, ParsedMessage } from "../../shared/messages/schema";

class OutgoingMessage<T extends MESSAGE_TYPE> extends Component {
  parsedMessage: ParsedMessage<T>;

  constructor(entityId: EntityId, parsedMessage: ParsedMessage<T>) {
    super(entityId);
    this.parsedMessage = parsedMessage;
  }
}

export default OutgoingMessage;
