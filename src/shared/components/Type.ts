import { EntityId } from "../ecs/types";
import { Int32, MESSAGE_TYPE, UInt8 } from "../messages/schema";
import Networked from "./Networked";

export enum CharacterType {
  Hunter, // default
  Hacker,
  // TODO: rest
}
// TODO: optimize with ArrayBuffers ??
class Type extends Networked<MESSAGE_TYPE.TYPE> {
  type: CharacterType;

  constructor(entityId: EntityId, type: CharacterType) {
    super(entityId);
    this.type = type;
  }

  get parsedMessage(): { type: UInt8; entityId: Int32 } {
    const { type, entityId } = this;
    return <{ type: UInt8; entityId }>(<any>{ type, entityId });
  }
}

export default Type;
