import Component from "../ecs/Component";
import { EntityId } from "../ecs/types";

// TODO: optimize with ArrayBuffers ??
class Name extends Component {
  name: string;

  constructor(entityId: EntityId, name: string) {
    super(entityId);
    this.name = name;
  }
}

export default Name;
