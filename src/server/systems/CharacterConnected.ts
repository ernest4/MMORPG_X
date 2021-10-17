import ConnectionEvent from "../../shared/components/ConnectionEvent";
import Transform from "../../shared/components/Transform";
import { Engine } from "../../shared/ecs";
import Networked from "../../shared/systems/Networked";
import { EntityId, QuerySet } from "../../shared/ecs/types";
import { SparseSetItem } from "../../shared/ecs/utils/SparseSet";
import Name from "../../shared/components/Name";
// import Type from "../../shared/components/characterTypes";
import NearbyCharacters from "../components/NearbyCharacters";
import Room from "../components/Room";
import State from "../game/State";
import HitPoints from "../../shared/components/HitPoints";
import { MESSAGE_TYPE } from "../../shared/messages/schema";
// import Networked from "../../shared/components/interfaces/Networked";
import Character from "../../shared/components/Character";
import Hunter from "../../shared/components/characterTypes/Hunter";

const queryComponents = [ConnectionEvent, Room, NearbyCharacters];

class CharacterConnected extends Networked {
  private _state: State;

  constructor(engine: Engine, state: State) {
    super(engine);
    this._state = state;
  }

  start(): void {}

  update(): void {
    this.engine.query(this.createOutMessages, ...queryComponents);
  }

  destroy(): void {}

  private createOutMessages = (querySet: QuerySet) => {
    const [{ id: newCharacterId }, room, nearbyCharacters] = querySet as [
      ConnectionEvent,
      Room,
      NearbyCharacters
    ];

    // TODO: future 'Entity' API sample: ...
    // const entity = this.engine.getEntity(connectionEvent.id);
    // const components = entity.getComponents(...queryComponents) as ComponentsSet;
    // OR? const components = entity.getComponents<ComponentsSet>(...queryComponents);

    const newCharacterComponents = this.getCharacterComponents(newCharacterId);
    this.addOutMessageComponentWith(
      MESSAGE_TYPE.ROOM_INIT,
      this._state.rooms[room.roomName],
      newCharacterId
    );
    this.addOutMessageComponents(newCharacterComponents);

    nearbyCharacters.entityIdSet.stream(({ id: nearbyCharacterId }: SparseSetItem) => {
      const nearbyCharacterComponents = this.getCharacterComponents(nearbyCharacterId);
      this.addOutMessageComponents(newCharacterComponents, nearbyCharacterId);
      this.addOutMessageComponents(nearbyCharacterComponents, newCharacterId);
    });
  };

  private getCharacterComponents = (entityId: EntityId) => {
    return [
      this.engine.getComponentById(entityId, Character),
      this.engine.getComponentById(entityId, Name),
      // this.engine.getComponentById(entityId, Type),
      this.engine.getComponentById(entityId, Hunter), // TODO: hmmm... how ill i get all the different class types in one go now...?
      this.engine.getComponentById(entityId, HitPoints),
      this.engine.getComponentById(entityId, Transform),
    ];
  };
}

export default CharacterConnected;
