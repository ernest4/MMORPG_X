import Component from "../../ecs/Component";
import { EntityId } from "../../ecs/types";
import { MESSAGE_TYPE, ParsedMessage } from "../../messages/schema";
import Networked from "../interfaces/Networked";

// Medium Tech ('mage') class
// TODO: optimize with ArrayBuffers ??
class Hacker extends Component implements Networked<MESSAGE_TYPE.HACKER> {
  constructor(entityId: EntityId) {
    super(entityId);
  }

  parsedMessage = (): ParsedMessage<MESSAGE_TYPE.HACKER> => {
    const { entityId } = this;
    return { messageType: MESSAGE_TYPE.HACKER, entityId };
  };

  synchronizeFrom = (parsedMessage: ParsedMessage<MESSAGE_TYPE.HACKER>) => {
    // NOOP
  };
}

export default Hacker;
