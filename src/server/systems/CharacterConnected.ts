import ConnectionEvent from "../../shared/components/ConnectionEvent";
import Transform from "../../shared/components/Transform";
import { Engine } from "../../shared/ecs";
import System from "../../shared/ecs/System";
import { EntityId, QuerySet } from "../../shared/ecs/types";
import { SparseSetItem } from "../../shared/ecs/utils/SparseSet";
import Name from "../../shared/components/Name";
import Type from "../../shared/components/Type";
import NearbyCharacters from "../components/NearbyCharacters";
import OutMessage from "../../shared/components/OutgoingMessage";
import Room from "../components/Room";
import State from "../game/State";
import HitPoints from "../../shared/components/HitPoints";
import { MESSAGE_TYPE } from "../../shared/messages/schema";
import Networked from "../../shared/components/interfaces/Networked";
import Character from "../../shared/components/Character";

const queryComponents = [ConnectionEvent, Room, NearbyCharacters];

class CharacterConnected extends System {
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
    outMessageComponents = [
      this.createRoomInitMessageComponent(room, newCharacterId), // TODO: convert this to newOutMessage ??!?
      ...this.newOutMessages(newCharacterComponents),
    ];

    nearbyCharacters.entityIdSet.stream(({ id: nearbyCharacterId }: SparseSetItem) => {
      const nearbyCharacterComponents = this.getCharacterComponents(nearbyCharacterId);
      outMessageComponents = [
        ...outMessageComponents,
        ...this.newOutMessages(newCharacterComponents, nearbyCharacterId),
        ...this.newOutMessages(nearbyCharacterComponents, newCharacterId),
      ];
    });

    this.engine.addComponents(...outMessageComponents);
  };

  // TODO: sketch...move out to utils?
  private newOutMessage = <T extends MESSAGE_TYPE>(
    { messageType, parsedMessage, entityId }: Networked<T>,
    recipient?: EntityId
  ) => {
    return new OutMessage(this.newEntityId(), messageType, parsedMessage, recipient || entityId);
  };

  // TODO: sketch...move out to utils?
  private newOutMessages = (components: Networked<any>[], recipient?: EntityId) => {
    return components.map(component => this.newOutMessage(component, recipient));
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
      this.engine.getComponent<Character>(Character, entityId),
      this.engine.getComponent<Name>(Name, entityId),
      this.engine.getComponent<Type>(Type, entityId),
      this.engine.getComponent<HitPoints>(HitPoints, entityId),
      this.engine.getComponent<Transform>(Transform, entityId),
    ];
  };
}

export default CharacterConnected;
