import Component from "../../shared/ecs/Component";
import { EntityId } from "../../shared/ecs/types";

// TODO: optimize with ArrayBuffers ??
class Speed extends Component {
  speed: number;

  constructor(entityId: EntityId, speed: number) {
    super(entityId);
    this.speed = speed;
  }
}

export default Speed;
