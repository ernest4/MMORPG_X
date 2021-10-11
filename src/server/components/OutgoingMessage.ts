
import Component from "../../shared/ecs/Component";
import { EntityId } from "../../shared/ecs/types";

// TODO: optimize with ArrayBuffers ??
class OutgoingMessage extends Component {
  parsedMessage: any; // hash...
  toEntityId?: EntityId;

  constructor(entityId: EntityId, parsedMessage, toEntityId?: EntityId) {
    super(entityId);
    this.parsedMessage = parsedMessage;
    this.toEntityId = toEntityId;
  }
}

export default OutgoingMessage;
