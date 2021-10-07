import Component from "../../shared/ecs/Component";
import { EntityId } from "../../shared/ecs/types";

// TODO: optimize with ArrayBuffers ??
class ClientMessageEvent extends Component {
  fromEntityId: EntityId;
  binaryMessage: ArrayBuffer;

  constructor(entityId: EntityId, fromEntityId: EntityId, binaryMessage: ArrayBuffer) {
    super(entityId);
    this.fromEntityId = fromEntityId;
    this.binaryMessage = binaryMessage;
  }
}

export default ClientMessageEvent;
