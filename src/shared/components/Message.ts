import Component from "../ecs/Component";
import { EntityId } from "../../shared/ecs/types";

// TODO: optimize with ArrayBuffers ??
class Message extends Component {
  parsedMessage: any; // hash...
  fromEntityId?: EntityId;

  constructor(entityId: EntityId, parsedMessage, fromEntityId?: EntityId) {
    super(entityId);
    this.parsedMessage = parsedMessage;
    this.fromEntityId = fromEntityId;
  }
}

export default Message;
