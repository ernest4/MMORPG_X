import Component from "../ecs/Component";
import { EntityId } from "../ecs/types";

export enum CharacterType {
  Hunter, // default
  Hacker,
  // TODO: rest
}
// TODO: optimize with ArrayBuffers ??
class Type extends Component {
  type: CharacterType;

  constructor(entityId: EntityId, type: CharacterType) {
    super(entityId);
    this.type = type;
  }
}

export default Type;
