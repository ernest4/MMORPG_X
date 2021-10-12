import { Engine } from "../../shared/ecs";
import System from "../../shared/ecs/System";
import WebSocket from "../components/WebSocket";
import { QuerySet } from "../../shared/ecs/types";
import Transform from "../../shared/components/Transform";
import Character from "../../shared/components/Character";
import CharacterConnected from "../../shared/components/message/CharacterConnected";
import Name from "../../shared/components/Name";
import HitPoints from "../../shared/components/HitPoints";

class CharacterDeserializer extends System {
  constructor(engine: Engine) {
    super(engine);
  }

  start(): void {}

  update(): void {
    this.engine.query(this.createCharacterComponents, CharacterConnected, WebSocket);
  }

  destroy(): void {}

  private createCharacterComponents = (querySet: QuerySet) => {
    const [characterConnected, webSocket] = querySet as [CharacterConnected, WebSocket];
    const { characterId, characterName, x, y, z, hitpoints } = characterConnected.parsedMessage;

    const entityId = this.engine.generateEntityIdWithAlias(characterId);
    // const entityId = this.engine.getEntityIdByAlias(characterId);
    // const characterId = this.engine.getAliasIdByEntityId(entityId);
    // const component = this.engine.getComponentByAliasEntityId(Character, characterId); // => character.id => entityId
    const characterComponents = [
      new Character(entityId),
      new Name(entityId, characterName),
      new HitPoints(entityId, hitpoints),
      new Transform(entityId, { x, y, z }),
    ];

    this.engine.addComponents(...characterComponents);
  };
}

export default CharacterDeserializer;
