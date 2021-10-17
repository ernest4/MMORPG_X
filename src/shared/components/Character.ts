import { EntityId } from "../ecs/types";
import { Int32, MESSAGE_TYPE } from "../messages/schema";
import Networked from "./Networked";

// TODO: optimize with ArrayBuffers ??
class Character extends Networked<MESSAGE_TYPE.CHARACTER> {
  constructor(entityId: EntityId) {
    super(entityId);
  }

  get parsedMessage(): { entityId: Int32 } {
    return this;
  }
}

export default Character;
