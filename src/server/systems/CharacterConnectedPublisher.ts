import ConnectionEvent from "../../shared/components/ConnectionEvent";
import { Engine } from "../../shared/ecs";
import Publisher from "../../shared/systems/Publisher";
import { QuerySet } from "../../shared/ecs/types";
import { SparseSetItem } from "../../shared/ecs/utils/SparseSet";
import NearbyCharacters from "../components/NearbyCharacters";
import Room from "../components/Room";
import State from "../game/State";
import { MESSAGE_TYPE } from "../../shared/messages/schema";
import NearbyCharacterConnectedEvent from "../components/NearbyCharacterConnectedEvent";

class CharacterConnected extends Publisher {
  private _state: State;

  constructor(engine: Engine, state: State) {
    super(engine);
    this._state = state;
  }

  start(): void {}

  update(): void {
    this.engine.query(this.createOutMessages, ConnectionEvent, Room, NearbyCharacters);
  }

  destroy(): void {}

  private createOutMessages = (querySet: QuerySet) => {
    const [{ id: newCharacterId }, room, nearbyCharacters] = querySet as [
      ConnectionEvent,
      Room,
      NearbyCharacters
    ];

    const { tileSizeInPx, widthInTiles, heightInTiles, tiles } = this._state.rooms[room.roomName];
    this.addOutMessageComponentWith(
      { messageType: MESSAGE_TYPE.ROOM_INIT, tileSizeInPx, widthInTiles, heightInTiles, tiles },
      newCharacterId
    );

    nearbyCharacters.entityIdSet.stream(({ id: nearbyCharacterId }: SparseSetItem) => {
      // NOTE: this will trigger this nearby character to broadcast its components to the new character
      this.engine.addComponent(
        new NearbyCharacterConnectedEvent(this.newEntityId(), nearbyCharacterId)
      );
    });
  };

  // Legacy: this has been generalized out to NetworkedComponentNearbyPublisher()
  // private createOutMessages = (querySet: QuerySet) => {
  //   const [{ id: newCharacterId }, room, nearbyCharacters] = querySet as [
  //     ConnectionEvent,
  //     Room,
  //     NearbyCharacters
  //   ];

  //   // TODO: future 'Entity' API sample: ...
  //   // const entity = this.engine.getEntity(connectionEvent.id);
  //   // const components = entity.getComponents(...queryComponents) as ComponentsSet;
  //   // OR? const components = entity.getComponents<ComponentsSet>(...queryComponents);

  //   const newCharacterComponents = this.getCharacterComponents(newCharacterId);
  //   this.addOutMessageComponentWith(
  //     MESSAGE_TYPE.ROOM_INIT,
  //     this._state.rooms[room.roomName],
  //     newCharacterId
  //   );
  //   this.addOutMessageComponents(newCharacterComponents);

  //   nearbyCharacters.entityIdSet.stream(({ id: nearbyCharacterId }: SparseSetItem) => {
  //     const nearbyCharacterComponents = this.getCharacterComponents(nearbyCharacterId);
  //     this.addOutMessageComponents(newCharacterComponents, nearbyCharacterId);
  //     this.addOutMessageComponents(nearbyCharacterComponents, newCharacterId);
  //   });
  // };

  // private getCharacterComponents = (entityId: EntityId) => {
  //   return [
  //     this.engine.getComponentById(entityId, Character),
  //     this.engine.getComponentById(entityId, Name),
  //     // this.engine.getComponentById(entityId, Type),
  //     this.engine.getComponentById(entityId, Hunter), // TODO: hmmm... how ill i get all the different class types in one go now...?
  //     this.engine.getComponentById(entityId, HitPoints),
  //     this.engine.getComponentById(entityId, Transform),
  //   ];
  // };
}

export default CharacterConnected;
