import ConnectionEvent from "../../shared/components/ConnectionEvent";
import Transform from "../../shared/components/Transform";
import { Engine } from "../../shared/ecs";
import System from "../../shared/ecs/System";
import { EntityId } from "../../shared/ecs/types";
import { SparseSetItem } from "../../shared/ecs/utils/SparseSet";
import Name from "../../shared/components/Name";
import Type from "../../shared/components/Type";
import NearbyCharacters from "../components/NearbyCharacters";
import OutMessage from "../../shared/components/OutgoingMessage";
import Room from "../components/Room";
import State from "../game/State";
import HitPoints from "../../shared/components/HitPoints";
import { MESSAGE_TYPE } from "../../shared/messages/schema";
import Component from "../../shared/ecs/Component";
import Networked from "../../shared/components/Networked";

const queryComponents = [ConnectionEvent, Name, Type, HitPoints, Transform, Room, NearbyCharacters];
type ComponentsSet = [ConnectionEvent, Name, Type, HitPoints, Transform, Room, NearbyCharacters];
class CharacterConnected extends System {
  private _state: State;

  constructor(engine: Engine, state: State) {
    super(engine);
    this._state = state;
  }

  start(): void {}

  update(): void {
    this.engine.query(this.createServerMessages, ...queryComponents);
  }

  destroy(): void {}

  private createServerMessages = (querySet: ComponentsSet) => {
    const [connectionEvent, name, type, hitPoints, transform, room, nearbyCharacters] = querySet;

    // TODO: future 'Entity' API sample: ...
    // const entity = this.engine.getEntity(connectionEvent.id);
    // const components = entity.getComponents(...queryComponents) as ComponentsSet;
    // OR? const components = entity.getComponents<ComponentsSet>(...queryComponents);

    let serverMessageComponents: OutMessage<any>[] = [];
    const newCharacterId = connectionEvent.id;

    serverMessageComponents = [
      // TODO: convert these to newOutMessage ??!?
      this.createRoomInitMessageComponent(room, newCharacterId),
      this.createConnectedMessageComponent(name, type, newCharacterId),
      this.newOutMessage(hitPoints, newCharacterId),
      this.newOutMessage(transform, newCharacterId),
    ];

    nearbyCharacters.entityIdSet.stream(({ id: nearbyCharacterId }: SparseSetItem) => {
      const nearbyCharacterName = this.engine.getComponent<Name>(Name, nearbyCharacterId);
      const nearbyCharacterType = this.engine.getComponent<Type>(Type, nearbyCharacterId);
      const nearbyCharacterTransform = this.engine.getComponent<Transform>(
        Transform,
        nearbyCharacterId
      );
      const nearbyCharacterHitPoints = this.engine.getComponent<HitPoints>(
        HitPoints,
        nearbyCharacterId
      );

      serverMessageComponents = [
        ...serverMessageComponents,
        this.createConnectedMessageComponent(name, type, nearbyCharacterId),
        this.newOutMessage(transform, nearbyCharacterId),
        this.newOutMessage(hitPoints, nearbyCharacterId),
        this.createConnectedMessageComponent(
          nearbyCharacterName,
          nearbyCharacterType,
          newCharacterId
        ),
        this.newOutMessage(nearbyCharacterTransform, newCharacterId),
        this.newOutMessage(nearbyCharacterHitPoints, newCharacterId),
      ];
    });

    this.engine.addComponents(...serverMessageComponents);
  };

  // TODO: sketch...
  private newOutMessage = <T extends MESSAGE_TYPE>(
    { messageType, parsedMessage }: Networked<T>,
    to: EntityId
  ) => {
    return new OutMessage(this.newEntityId(), messageType, parsedMessage, to);
  };

  private createRoomInitMessageComponent = ({ roomName }: Room, toEntityId: EntityId) => {
    const { tileSizeInPx, widthInTiles, heightInTiles, tiles } = this._state.rooms[roomName];
    return new OutMessage(
      this.newEntityId(),
      MESSAGE_TYPE.ROOM_INIT,
      { tileSizeInPx, widthInTiles, heightInTiles, tiles },
      toEntityId
    );
  };

  private createConnectedMessageComponent = (
    { id: characterId, name: characterName }: Name,
    { type }: Type,
    toEntityId: EntityId
  ) => {
    return new OutMessage(
      this.newEntityId(),
      MESSAGE_TYPE.CHARACTER_CONNECTED,
      { characterId, characterName, characterType: <number>type },
      toEntityId
    );
  };
}

export default CharacterConnected;
