import Component from "../../ecs/Component";
import { EntityId } from "../../ecs/types";
import { Int32, MESSAGE_TYPE } from "../../messages/schema";
import Networked from "../interfaces/Networked";

// TODO: optimize with ArrayBuffers ??
class Hunter extends Component implements Networked<MESSAGE_TYPE.HUNTER> {
  messageType: MESSAGE_TYPE.HUNTER;

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

export default Hunter;
