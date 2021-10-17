import { Engine } from "../../shared/ecs";
import System from "../../shared/ecs/System";
import WebSocket from "../components/WebSocket";
import { QuerySet } from "../../shared/ecs/types";
import Transform from "../../shared/components/Transform";
import Character from "../../shared/components/Character";
import Name from "../../shared/components/Name";
import HitPoints from "../../shared/components/HitPoints";
import Type, { CharacterType } from "../../shared/components/characterTypes";
import { CharacterMessage } from "../../shared/messages/schema";

class CharacterDeserializer extends System {
  constructor(engine: Engine) {
    super(engine);
  }

  start(): void {}

  update(): void {
    this.engine.query(this.createCharacterComponents, CharacterMessage, WebSocket);
  }

  destroy(): void {}

  private createCharacterComponents = (querySet: QuerySet) => {
    const [characterConnected, webSocket] = querySet as [CharacterMessage, WebSocket];
    const { characterId, characterName, characterType } = characterConnected.parsedMessage;

    const newCharacterEntityId = this.engine.newEntityIdWithAlias(<number>characterId);
    const characterComponents = [
      new Character(newCharacterEntityId),
      new Name(newCharacterEntityId, characterName),
      new HitPoints(newCharacterEntityId, hitpoints),
      new Transform(newCharacterEntityId, { x, y, z }),
      new Type(newCharacterEntityId, <CharacterType>(<any>characterType)),
    ];
    this.engine.addComponents(...characterComponents);
  };
}

export default CharacterDeserializer;
