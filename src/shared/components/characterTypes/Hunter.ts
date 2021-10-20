import Component from "../../ecs/Component";
import { EntityId } from "../../ecs/types";
import { MESSAGE_TYPE, ParsedMessage } from "../../messages/schema";
import Networked from "../interfaces/Networked";

// Heavy rifle / sniper class
// TODO: optimize with ArrayBuffers ??
class Hunter extends Component implements Networked<MESSAGE_TYPE.HUNTER> {
  constructor(entityId: EntityId) {
    super(entityId);
  }

  parsedMessage = (): ParsedMessage<MESSAGE_TYPE.HUNTER> => {
    const { entityId } = this;
    return { messageType: MESSAGE_TYPE.HUNTER, entityId };
  };

  synchronizeFrom = (parsedMessage: ParsedMessage<MESSAGE_TYPE.HUNTER>) => {
    // NOOP
  };
}

export default Hunter;
