import Component from "../ecs/Component";
import { EntityId } from "../../shared/ecs/types";

// TODO: optimize with ArrayBuffers ??
class Message extends Component {
  fromEntityId: EntityId | null;
  parsedMessage: any; // hash...

  constructor(entityId: EntityId, fromEntityId: EntityId | null, parsedMessage) {
    super(entityId);
    this.fromEntityId = fromEntityId;
    this.parsedMessage = parsedMessage;
  }
}

export default Message;
