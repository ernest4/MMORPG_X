import Component from "../../shared/ecs/Component";
import { EntityId } from "../../shared/ecs/types";
import { INPUT_EVENT_TYPE, INPUT_KEY } from "../systems/InputListener";

// TODO: optimize with ArrayBuffers ??
class InputEvent extends Component {
  type: INPUT_EVENT_TYPE;
  key: INPUT_KEY;

  constructor(entityId: EntityId, type: INPUT_EVENT_TYPE, key: INPUT_KEY) {
    super(entityId);
    this.type = type;
    this.key = key;
  }
}

export default InputEvent;
