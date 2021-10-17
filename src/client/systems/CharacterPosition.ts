import { Engine } from "../../shared/ecs";
import System from "../../shared/ecs/System";
import { QuerySet } from "../../shared/ecs/types";
import Transform from "../../shared/components/Transform";
import Position from "../../shared/components/message/Position";

class CharacterPosition extends System {
  constructor(engine: Engine) {
    super(engine);
  }

  start(): void {}

  update(): void {
    this.engine.query(this.applyPositionMessage, Position);
  }

  destroy(): void {}

  private applyPositionMessage = (querySet: QuerySet) => {
    const [position] = querySet as [Position];
    const { characterId, x, y, z } = position.parsedMessage;

    const entityId = this.engine.getEntityIdByAlias(characterId);

    if (entityId) {
      const transform = this.engine.getComponentById<Transform>(Transform, entityId);
      if (transform) transform.position.xyz = { x, y, z };
    }
  };
}

export default CharacterPosition;
