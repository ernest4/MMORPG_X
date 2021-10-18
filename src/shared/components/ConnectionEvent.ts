import Component from "../ecs/Component";
import { EntityId } from "../../shared/ecs/types";
import Event from "./interfaces/Event";

// TODO: optimize with ArrayBuffers ??
class ConnectionEvent extends Component implements Event {
  constructor(entityId: EntityId) {
    super(entityId);
  }

  get targetEntityId(): EntityId {
    return this.entityId;
  }
}

export default ConnectionEvent;
