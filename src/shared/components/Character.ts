import Component from "../ecs/Component";
import { EntityId } from "../ecs/types";
import { Int32, MESSAGE_TYPE } from "../messages/schema";
import Networked from "./interfaces/Networked";

// TODO: optimize with ArrayBuffers ??
class Character extends Component implements Networked<MESSAGE_TYPE.CHARACTER> {
  messageType: MESSAGE_TYPE.CHARACTER;

  constructor(entityId: EntityId) {
    super(entityId);
  }

  get parsedMessage(): { entityId: Int32 } {
    return this;
  }
}

export default Character;
