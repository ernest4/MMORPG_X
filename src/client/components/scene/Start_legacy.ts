import Component from "../../../shared/ecs/Component";
import { EntityId } from "../../../shared/ecs/types";

// TODO: optimize with ArrayBuffers ??
class Start extends Component {
  sceneEntityId: EntityId;

  constructor(entityId: EntityId, sceneEntityId: EntityId) {
    super(entityId);
    this.sceneEntityId = sceneEntityId;
  }
}

export default Start;
