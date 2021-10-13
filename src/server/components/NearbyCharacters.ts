import Component from "../../shared/ecs/Component";
import { EntityId } from "../../shared/ecs/types";
import SparseSet from "../../shared/ecs/utils/SparseSet";

// TODO: optimize with ArrayBuffers ??
class NearbyCharacters extends Component {
  entityIdSet: SparseSet;

  constructor(entityId: EntityId) {
    super(entityId);
    this.entityIdSet = new SparseSet();
  }
}

export default NearbyCharacters;
