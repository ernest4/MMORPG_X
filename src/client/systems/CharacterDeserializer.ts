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
    const { characterId, characterName, x, y, z, hitpoints, type } = characterConnected.parsedMessage;

    const newCharacterEntityId = this.engine.generateEntityIdWithAlias(characterId);
    const characterComponents = [
      new Character(newCharacterEntityId),
      new Name(newCharacterEntityId, characterName),
      new HitPoints(newCharacterEntityId, hitpoints),
      new Transform(newCharacterEntityId, { x, y, z }),
    ];
    this.engine.addComponents(...characterComponents);
  };
}

export default CharacterDeserializer;
