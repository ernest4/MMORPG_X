import Component from "../../ecs/Component";
import { EntityId } from "../../ecs/types";
import { Int32, MESSAGE_TYPE } from "../../messages/schema";
import Networked from "../interfaces/Networked";

// Medium Tech ('mage') class
// TODO: optimize with ArrayBuffers ??
class Hacker extends Component implements Networked<MESSAGE_TYPE.HACKER> {
  messageType: MESSAGE_TYPE.HACKER;

  constructor(entityId: EntityId) {
    super(entityId);
  }

  get parsedMessage(): { entityId: Int32 } {
    return this;
  }

  synchronizeFrom(parsedMessage: { entityId: Int32 }) {
    // NOOP
  }
}

export default Hacker;
