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

  // TODO: how the feck will i match up the received characterId (entityId)
  // from server to the one in client?? the two aren't in sync...
  // Maybe new ability of engine to transfer all components from one entityId to another
  // this.engine.freeEntityId(entityId) // => will transfer any components from one entityId to new generated one...but some components hold references to entityIds...problem...
  private createCharacterComponents = (querySet: QuerySet) => {
    const [characterConnected, webSocket] = querySet as [CharacterConnected, WebSocket];
    const { characterId, characterName, x, y, z, hitpoints } = characterConnected.parsedMessage;

    // const entityId = this.engine.generateEntityId();
    this.engine.freeEntityId(characterId); // something like that?
    const characterComponents = [
      new Character(characterId),
      new Name(characterId, characterName),
      new HitPoints(characterId, hitpoints),
      new Transform(characterId, { x, y, z }),
    ];

    this.engine.addComponents(...characterComponents);
  };
}

export default CharacterDeserializer;
