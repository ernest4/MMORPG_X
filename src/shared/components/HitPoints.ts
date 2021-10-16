import Component from "../ecs/Component";
import { EntityId } from "../ecs/types";
import { Int32 } from "../messages/schema";

// TODO: optimize with ArrayBuffers ??
class HitPoints extends Component {
  hitPoints: Int32;

  constructor(entityId: EntityId, hitPoints: Int32) {
    super(entityId);
    this.hitPoints = hitPoints;
  }
}

export default HitPoints;
