import Component from "../../ecs/Component";
import { EntityId } from "../../ecs/types";

// TODO: optimize with ArrayBuffers ??
class SerializeEvent extends Component {
  constructor(entityId: EntityId) {
    super(entityId);
  }
}

export default SerializeEvent;
