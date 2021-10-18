import Transform from "../../shared/components/Transform";
import { Engine } from "../../shared/ecs";
import Publisher from "../../shared/systems/Publisher";
import { QuerySet } from "../../shared/ecs/types";
import { SparseSetItem } from "../../shared/ecs/utils/SparseSet";
import NearbyCharacters from "../components/NearbyCharacters";

class TransformChanged extends Publisher {
  constructor(engine: Engine) {
    super(engine);
  }

  start(): void {}

  // TODO: Need a way to track changes on the components itself and broadcast it then instead of
  // always...
  update(): void {
    this.engine.query(this.createOutMessages, Transform);
  }

  destroy(): void {}

  private createOutMessages = (querySet: QuerySet) => {
    const [{ entityId }] = querySet as [Transform];

    // TODO: use future 'Entity' api here...??
    const [nearbyCharacters, transform] = <[NearbyCharacters, Transform]>(
      this.engine.getComponentsById(entityId, NearbyCharacters, Transform)
    );

    this.addOutMessageComponent(transform);

    nearbyCharacters.entityIdSet.stream(({ id: nearbyCharacterEntityId }: SparseSetItem) => {
      this.addOutMessageComponent(transform, nearbyCharacterEntityId);
    });
  };
}

export default TransformChanged;
