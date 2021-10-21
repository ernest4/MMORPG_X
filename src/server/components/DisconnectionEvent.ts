import Event from "../../shared/components/interfaces/Event";
import Component from "../../shared/ecs/Component";
import { EntityId } from "../../shared/ecs/types";

// TODO: optimize with ArrayBuffers ??
class DisconnectionEvent extends Component implements Event {
  targetEntityId: EntityId;

  constructor(entityId: EntityId) {
    super(entityId);
  }
}

export default DisconnectionEvent;
