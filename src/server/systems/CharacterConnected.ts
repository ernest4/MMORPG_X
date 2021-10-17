import ConnectionEvent from "../../shared/components/ConnectionEvent";
import Transform from "../../shared/components/Transform";
import { Engine } from "../../shared/ecs";
import Networked from "./Networked";
import { EntityId, QuerySet } from "../../shared/ecs/types";
import { SparseSetItem } from "../../shared/ecs/utils/SparseSet";
import Name from "../../shared/components/Name";
import Type from "../../shared/components/characterTypes";
import NearbyCharacters from "../components/NearbyCharacters";
import OutMessage from "../../shared/components/OutMessage";
import Room from "../components/Room";
import State from "../game/State";
import HitPoints from "../../shared/components/HitPoints";
import { MESSAGE_TYPE } from "../../shared/messages/schema";
// import Networked from "../../shared/components/interfaces/Networked";
import Character from "../../shared/components/Character";

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

    let outMessageComponents: OutMessage<any>[] = [];

    const newCharacterComponents = this.getCharacterComponents(newCharacterId);
    this.engine.addComponent(this.createRoomInitMessageComponent(room, newCharacterId));
    this.addOutMessageComponents(newCharacterComponents);
    // outMessageComponents = [
    //   this.createRoomInitMessageComponent(room, newCharacterId), // TODO: convert this to newOutMessage ??!?
    //   ...this.newOutMessageComponents(newCharacterComponents),
    // ];

    nearbyCharacters.entityIdSet.stream(({ id: nearbyCharacterId }: SparseSetItem) => {
      const nearbyCharacterComponents = this.getCharacterComponents(nearbyCharacterId);
      // outMessageComponents = [
      //   ...outMessageComponents,
      //   ...this.newOutMessageComponents(newCharacterComponents, nearbyCharacterId),
      //   ...this.newOutMessageComponents(nearbyCharacterComponents, newCharacterId),
      // ];
      this.addOutMessageComponents(newCharacterComponents, nearbyCharacterId);
      this.addOutMessageComponents(nearbyCharacterComponents, newCharacterId);
    });

    // this.engine.addComponents(...outMessageComponents);
  };

  private createRoomInitMessageComponent = ({ roomName }: Room, toEntityId: EntityId) => {
    return new OutMessage(
      this.newEntityId(),
      MESSAGE_TYPE.ROOM_INIT,
      this._state.rooms[roomName],
      toEntityId
    );
  };

  private getCharacterComponents = (entityId: EntityId) => {
    return [
      this.engine.getComponentById(entityId, Character),
      this.engine.getComponentById(entityId, Name),
      this.engine.getComponentById(entityId, Type),
      this.engine.getComponentById(entityId, HitPoints),
      this.engine.getComponentById(entityId, Transform),
    ];
  };
}

export default CharacterConnected;
