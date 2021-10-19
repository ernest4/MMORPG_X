import Component from "../../ecs/Component";
import { EntityId } from "../../ecs/types";

interface Event extends Component {
  readonly targetEntityId: EntityId;
}

export default Event;
