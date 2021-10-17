import Component from "../ecs/Component";
import { EntityId } from "../ecs/types";
import { Int32, MESSAGE_TYPE } from "../messages/schema";
import Networked from "./interfaces/Networked";

// TODO: optimize with ArrayBuffers ??
class Name extends Component implements Networked<MESSAGE_TYPE.NAME> {
  name: string;
  messageType: MESSAGE_TYPE.NAME;

  constructor(entityId: EntityId, name: string) {
    super(entityId);
    this.name = name;
  }

  get parsedMessage(): { name: string; entityId: Int32 } {
    return this;
  }

  applyParsedMessage({ name }: { name: string; entityId: Int32 }) {
    this.name = name;
  }
}

export default Name;
