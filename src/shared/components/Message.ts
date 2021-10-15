import Component from "../ecs/Component";
import { EntityId } from "../../shared/ecs/types";

// TODO: optimize with ArrayBuffers ??
class Message extends Component {
  parsedMessage: any; // hash...
  from?: EntityId;

  constructor(entityId: EntityId, parsedMessage, from?: EntityId) {
    super(entityId);
    this.parsedMessage = parsedMessage;
    this.from = from;
  }
}

export default Message;
