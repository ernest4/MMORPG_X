import Component from "../../shared/ecs/Component";
import { EntityId } from "../../shared/ecs/types";

// TODO: optimize with ArrayBuffers ??
class OutgoingMessage extends Component {
  parsedMessage: any; // hash...

  constructor(entityId: EntityId, parsedMessage: any) {
    super(entityId);
    this.parsedMessage = parsedMessage;
  }
}

export default OutgoingMessage;
