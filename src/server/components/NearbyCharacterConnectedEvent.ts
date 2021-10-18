import Event from "../../shared/components/interfaces/Event";
import Component from "../../shared/ecs/Component";
import { EntityId } from "../../shared/ecs/types";

// TODO: optimize with ArrayBuffers ??
class NearbyCharacterConnectedEvent extends Component implements Event {
  targetEntityId: EntityId;

  constructor(entityId: EntityId, targetEntityId: EntityId) {
    super(entityId);
    this.targetEntityId = targetEntityId;
  }
}

export default NearbyCharacterConnectedEvent;
