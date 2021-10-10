import Component from "../../shared/ecs/Component";
import { EntityId } from "../../shared/ecs/types";

// TODO: optimize with ArrayBuffers ??
class MessageEvent extends Component {
  binaryMessage: ArrayBuffer;
  fromEntityId?: EntityId;

  constructor(entityId: EntityId, binaryMessage: ArrayBuffer, fromEntityId?: EntityId) {
    super(entityId);
    this.binaryMessage = binaryMessage;
    this.fromEntityId = fromEntityId;
  }
}

export default MessageEvent;
