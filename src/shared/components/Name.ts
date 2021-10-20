import Component from "../ecs/Component";
import { EntityId } from "../ecs/types";
import { MESSAGE_TYPE, ParsedMessage } from "../messages/schema";
import Networked from "./interfaces/Networked";

// TODO: optimize with ArrayBuffers ??
class Name extends Component implements Networked<MESSAGE_TYPE.NAME> {
  name: string;
  messageType: MESSAGE_TYPE.NAME;

  constructor(entityId: EntityId, name: string) {
    super(entityId);
    this.name = name;
  }

  parsedMessage = (): ParsedMessage<MESSAGE_TYPE.NAME> => {
    return this;
  };

  synchronizeFrom = ({ name }: ParsedMessage<MESSAGE_TYPE.NAME>) => {
    this.name = name;
  };
}

export default Name;
