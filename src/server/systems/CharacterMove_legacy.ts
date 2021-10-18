import Transform from "../../shared/components/Transform";
import { Engine } from "../../shared/ecs";
import Publisher from "../../shared/systems/Publisher";
import { QuerySet } from "../../shared/ecs/types";
import { SparseSetItem } from "../../shared/ecs/utils/SparseSet";
import NearbyCharacters from "../components/NearbyCharacters";
import { MoveMessage } from "../../shared/messages/schema";

class CharacterMove extends Publisher {
  constructor(engine: Engine) {
    super(engine);
  }

  start(): void {}

  // TODO: REFACTOR THIS!!! the system is inadequate. it only tries report transform
  // changes when there is a move message from character. But what about server or NPC
  // nocking back the character? then this wont trigger!
  // Need a way to track changes on the components itself and broadcast it then instead of always...
  update(): void {
    this.engine.query(this.createOutMessages, MoveMessage);
  }

  destroy(): void {}

  private createOutMessages = (querySet: QuerySet) => {
    const [{ sender }] = querySet as [MoveMessage];

    // TODO: use future 'Entity' api here...??
    const [nearbyCharacters, transform] = <[NearbyCharacters, Transform]>(
      this.engine.getComponentsById(sender, NearbyCharacters, Transform)
    );

    this.addOutMessageComponent(transform, sender);

    nearbyCharacters.entityIdSet.stream(({ id: nearbyCharacterEntityId }: SparseSetItem) => {
      this.addOutMessageComponent(transform, nearbyCharacterEntityId);
    });
  };
}

export default CharacterMove;
