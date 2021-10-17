import Component from "../ecs/Component";
import { EntityId } from "../ecs/types";
import { Int32, MESSAGE_TYPE, UInt8 } from "../messages/schema";
import Networked from "./interfaces/Networked";

export enum CharacterType {
  Hunter, // default
  Hacker,
  // TODO: rest
}
// TODO: optimize with ArrayBuffers ??
class Type extends Component implements Networked<MESSAGE_TYPE.TYPE> {
  type: CharacterType;
  messageType: MESSAGE_TYPE.TYPE;

  constructor(entityId: EntityId, type: CharacterType) {
    super(entityId);
    this.type = type;
  }

  get parsedMessage(): { type: UInt8; entityId: Int32 } {
    // const { type, entityId } = this;
    // return <{ type: UInt8; entityId }>(<any>{ type, entityId });
    return <{ type: UInt8; entityId }>(<any>this);
  }
}

export default Type;
