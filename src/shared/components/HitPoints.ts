import { EntityId } from "../ecs/types";
import { Int32, MESSAGE_TYPE } from "../messages/schema";
import Networked from "./Networked";

// TODO: optimize with ArrayBuffers ??
class HitPoints extends Networked<MESSAGE_TYPE.HITPOINTS> {
  hitPoints: Int32;

  constructor(entityId: EntityId, hitPoints: Int32) {
    super(entityId);
    this.hitPoints = hitPoints;
  }

  get parsedMessage(): { hitPoints: Int32; entityId: Int32 } {
    return this;
  }
}

export default HitPoints;
