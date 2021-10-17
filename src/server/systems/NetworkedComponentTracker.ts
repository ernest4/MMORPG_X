import { Engine } from "../../shared/ecs";
import Networked from "../../shared/systems/Networked";
import { QuerySet } from "../../shared/ecs/types";
import { SparseSetItem } from "../../shared/ecs/utils/SparseSet";
import NearbyCharacters from "../components/NearbyCharacters";

class NetworkedComponentTracker extends Networked {
  constructor(engine: Engine) {
    super(engine);
  }

  start(): void {}

  update(): void {
    this.engine.query(this.createOutMessages, NetworkedComponentChanged);
  }

  destroy(): void {}

  private createOutMessages = (querySet: QuerySet) => {
    const [{ componentId, componentClass }] = querySet as [NetworkedComponentChanged];

    const [nearbyCharacters, component] = <[NearbyCharacters, componentClass]>(
      this.engine.getComponentsById(componentId, NearbyCharacters, componentClass)
    );

    this.addOutMessageComponent(component);

    nearbyCharacters.entityIdSet.stream(({ id: nearbyCharacterEntityId }: SparseSetItem) => {
      this.addOutMessageComponent(component, nearbyCharacterEntityId);
    });
  };
}

export default NetworkedComponentTracker;
