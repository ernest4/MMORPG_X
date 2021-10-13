import Move from "../../shared/components/message/Move";
import Transform from "../../shared/components/Transform";
import { Engine } from "../../shared/ecs";
import System from "../../shared/ecs/System";
import { EntityId } from "../../shared/ecs/types";
import { SparseSetItem } from "../../shared/ecs/utils/SparseSet";
import NearbyCharacters from "../components/NearbyCharacters";
import OutgoingMessage from "../components/OutgoingMessage";

class CharacterMove extends System {
  constructor(engine: Engine) {
    super(engine);
  }

  start(): void {}

  update(): void {
    this.engine.query(this.createServerMessages, Move);
  }

  destroy(): void {}

  private createServerMessages = ([move]: [Move]) => {
    let serverMessageComponents: OutgoingMessage[] = [];

    // TODO: use future 'Entity' api here...
    const nearbyCharacters = this.engine.getComponent<NearbyCharacters>(NearbyCharacters, move.id);
    const transform = this.engine.getComponent<Transform>(Transform, move.id);

    serverMessageComponents.push(this.createPositionMessageComponent(transform, transform.id));

    nearbyCharacters.entityIdSet.stream(({ id: nearbyCharacterEntityId }: SparseSetItem) => {
      serverMessageComponents.push(
        this.createPositionMessageComponent(transform, nearbyCharacterEntityId)
      );
    });

    this.engine.addComponents(...serverMessageComponents);
  };

  private createPositionMessageComponent = (
    { position, id: characterId }: Transform,
    toEntityId: EntityId
  ) => {
    const parsedMessage = { characterId, ...position.xyz };
    return new OutgoingMessage(this.engine.generateEntityId(), parsedMessage, toEntityId);
  };
}

export default CharacterMove;
