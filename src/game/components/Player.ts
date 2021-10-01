import Component from "../../ecs/Component";
import { EntityId } from "../../ecs/types";

// TODO: optimize with ArrayBuffers ??
class Player extends Component {
  constructor(entityId: EntityId) {
    super(entityId, true);
  }
}

export default Player;
