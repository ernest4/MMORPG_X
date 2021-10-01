import Component from "../../ecs/Component";
import { EntityId, InputEventType } from "../../ecs/types";

// TODO: optimize with ArrayBuffers ??
class InputEvent extends Component {
  type!: InputEventType;
  key!: string;
  processed: boolean;

  constructor(entityId: EntityId) {
    super(entityId);
    this.processed = false;
  }
}

export default InputEvent;
