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
      const transform = this.engine.getComponent<Transform>(Transform, entityId);
      if (transform) transform.position.xyz = { x, y, z };
    }

    // TODO: entity api ?
    // const entity = this.engine.getEntityByAlias(characterId);
    // entity.components.transform.position.xyz = { x, y, z };
    // OR
    // entity.get.transform.position.xyz = { x, y, z };
    // OR
    // entity.get<Transform>(Transform).position.xyz = { x, y, z };
    // OR
    // entity.transform.xyz = { x, y, z }; // should be possible...something like
    // constructor(){
    // components.forEach(component => (this[component.constructor.name] = component))
    // }

    // maybe use callback so you dont have to check all the time if 
    // component present or not? it will either callback or wont
    // entity.transform(transform => transform.xyz = { x, y, z });

    // could also add engine.queryForEntities()
    // that just wraps the query set in entity basically...
  };
}

export default CharacterPosition;
