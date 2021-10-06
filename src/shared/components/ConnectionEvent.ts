import Component from "../ecs/Component";
import { EntityId } from "../../shared/ecs/types";

// TODO: optimize with ArrayBuffers ??
class ConnectionEvent extends Component {
  constructor(entityId: EntityId) {
    super(entityId);
  }
}

export default ConnectionEvent;
