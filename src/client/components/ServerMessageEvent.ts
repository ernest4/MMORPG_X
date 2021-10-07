import Component from "../../shared/ecs/Component";
import { EntityId } from "../../shared/ecs/types";

// TODO: optimize with ArrayBuffers ??
class ServerMessageEvent extends Component {
  binaryMessage: ArrayBuffer;

  constructor(entityId: EntityId, binaryMessage: ArrayBuffer) {
    super(entityId);
    this.binaryMessage = binaryMessage;
  }
}

export default ServerMessageEvent;
