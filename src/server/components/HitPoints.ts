import Component from "../../shared/ecs/Component";
import { EntityId } from "../../shared/ecs/types";

// TODO: optimize with ArrayBuffers ??
class HitPoints extends Component {
  hitPoints: number;

  constructor(entityId: EntityId, hitPoints: number) {
    super(entityId);
    this.hitPoints = hitPoints;
  }
}

export default HitPoints;
