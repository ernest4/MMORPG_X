import { EntityId } from "../ecs/types";
import { Int32, MESSAGE_TYPE } from "../messages/schema";
import Networked from "./Networked";

// TODO: optimize with ArrayBuffers ??
class Name extends Networked<MESSAGE_TYPE.NAME> {
  name: string;

  constructor(entityId: EntityId, name: string) {
    super(entityId);
    this.name = name;
  }

  get parsedMessage(): { name: string; entityId: Int32 } {
    return this;
  }
}

export default Name;
