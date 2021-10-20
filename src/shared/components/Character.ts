import Component from "../ecs/Component";
import { EntityId } from "../ecs/types";
import { MESSAGE_TYPE, ParsedMessage } from "../messages/schema";
import Networked from "./interfaces/Networked";

// TODO: optimize with ArrayBuffers ??
class Character extends Component implements Networked<MESSAGE_TYPE.CHARACTER> {
  constructor(entityId: EntityId) {
    super(entityId);
  }

  parsedMessage = (): ParsedMessage<MESSAGE_TYPE.CHARACTER> => {
    const { entityId } = this;
    return { messageType: MESSAGE_TYPE.CHARACTER, entityId };
  };

  synchronizeFrom = (parsedMessage: ParsedMessage<MESSAGE_TYPE.CHARACTER>) => {
    // NOOP
  };
}

export default Character;
