import Component from "../../shared/ecs/Component";
import { EntityId } from "../../shared/ecs/types";

// TODO: optimize with ArrayBuffers ??
class DisconnectionEvent extends Component {
  constructor(entityId: EntityId) {
    super(entityId);
  }
}

export default DisconnectionEvent;
