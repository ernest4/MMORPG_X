import Component from "../../shared/ecs/Component";
import { EntityId } from "../../shared/ecs/types";

// TODO: optimize with ArrayBuffers ??
class SerializeEvent extends Component {
  constructor(entityId: EntityId) {
    super(entityId);
  }
}

export default SerializeEvent;
