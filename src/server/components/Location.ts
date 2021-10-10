import Component from "../../shared/ecs/Component";
import { EntityId } from "../../shared/ecs/types";

// TODO: optimize with ArrayBuffers ??
class Location extends Component {
  locations: string;

  constructor(entityId: EntityId, locations: string) {
    super(entityId);
    this.locations = locations;
  }
}

export default Location;
