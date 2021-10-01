import Component from "../../shared/ecs/Component";
import { EntityId } from "../../shared/ecs/types";

// TODO: optimize with ArrayBuffers ??
class Tag extends Component {
  constructor(entityId: EntityId) {
    super(entityId, true);
  }
}

export default Tag;
