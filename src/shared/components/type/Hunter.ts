import Component from "../../ecs/Component";
import { EntityId } from "../../../shared/ecs/types";

// TODO: optimize with ArrayBuffers ??
class Hunter extends Component {
  constructor(entityId: EntityId) {
    super(entityId);
  }
}

export default Hunter;
