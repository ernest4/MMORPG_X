import Component from "../ecs/Component";
import { EntityId } from "../ecs/types";
import { Int32, MESSAGE_TYPE, ParsedMessage } from "../messages/schema";
import Networked from "./interfaces/Networked";

// TODO: optimize with ArrayBuffers ??
class HitPoints extends Component implements Networked<MESSAGE_TYPE.HITPOINTS> {
  hitPoints: Int32;
  messageType: MESSAGE_TYPE.HITPOINTS;

  constructor(entityId: EntityId, hitPoints: Int32) {
    super(entityId);
    this.hitPoints = hitPoints;
  }

  parsedMessage(): ParsedMessage<MESSAGE_TYPE.HITPOINTS> {
    return this;
  }

  synchronizeFrom({ hitPoints }: ParsedMessage<MESSAGE_TYPE.HITPOINTS>): void {
    this.hitPoints = hitPoints;
  }
}

export default HitPoints;
