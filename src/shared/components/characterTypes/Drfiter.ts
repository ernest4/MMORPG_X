import Component from "../../ecs/Component";
import { EntityId } from "../../ecs/types";
import { MESSAGE_TYPE, ParsedMessage } from "../../messages/schema";
import Networked from "../interfaces/Networked";

// Light jet packs class
// TODO: optimize with ArrayBuffers ??
class Drifter extends Component implements Networked<MESSAGE_TYPE.DRIFTER> {
  constructor(entityId: EntityId) {
    super(entityId);
  }

  parsedMessage = (): ParsedMessage<MESSAGE_TYPE.DRIFTER> => {
    const { entityId } = this;
    return { messageType: MESSAGE_TYPE.DRIFTER, entityId };
  };

  synchronizeFrom = (parsedMessage: ParsedMessage<MESSAGE_TYPE.DRIFTER>) => {
    // NOOP
  };
}

export default Drifter;
