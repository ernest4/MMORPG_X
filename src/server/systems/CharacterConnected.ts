import ConnectionEvent from "../../shared/components/ConnectionEvent";
import Transform from "../../shared/components/Transform";
import { Engine } from "../../shared/ecs";
import System from "../../shared/ecs/System";
import { EntityId } from "../../shared/ecs/types";
import { SparseSetItem } from "../../shared/ecs/utils/SparseSet";
import Name from "../../shared/components/Name";
import Type from "../../shared/components/Type";
import NearbyCharacters from "../components/NearbyCharacters";
import OutgoingMessage from "../../shared/components/OutgoingMessage";
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

    let serverMessageComponents: OutgoingMessage<any>[] = [];
    const newCharacterId = connectionEvent.id;

    serverMessageComponents = [
      this.createRoomInitMessageComponent(room, newCharacterId),
      this.createConnectedMessageComponent(name, type, newCharacterId),
      this.createHitPointsMessageComponent(hitPoints, newCharacterId),
      this.createPositionMessageComponent(transform, newCharacterId),
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
        this.createPositionMessageComponent(transform, nearbyCharacterId),
        this.createHitPointsMessageComponent(hitPoints, nearbyCharacterId),
        this.createConnectedMessageComponent(
          nearbyCharacterName,
          nearbyCharacterType,
          newCharacterId
        ),
        this.createPositionMessageComponent(nearbyCharacterTransform, newCharacterId),
        this.createHitPointsMessageComponent(nearbyCharacterHitPoints, newCharacterId),
      ];
    });

    // TODO: sketch
    this.generateMessage(transform, newCharacterId);

    this.engine.addComponents(...serverMessageComponents);
  };

  // TODO: sketch
  private generateMessage = ({ messageType, parsedMessage }: Networked<any>, to: EntityId) => {
    this.engine.addComponent(
      new OutgoingMessage(this.newEntityId(), messageType, parsedMessage, to)
    );
  };

  private createRoomInitMessageComponent = ({ roomName }: Room, toEntityId: EntityId) => {
    const { tileSizeInPx, widthInTiles, heightInTiles, tiles } = this._state.rooms[roomName];
    return new OutgoingMessage(
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
    return new OutgoingMessage(
      this.newEntityId(),
      MESSAGE_TYPE.CHARACTER_CONNECTED,
      { characterId, characterName, characterType: <number>type },
      toEntityId
    );
  };

  private createPositionMessageComponent = (
    { position, id: characterId }: Transform,
    toEntityId: EntityId
  ) => {
    return new OutgoingMessage(
      this.newEntityId(),
      MESSAGE_TYPE.TRANSFORM,
      { characterId, ...position.xyz },
      toEntityId
    );
  };

  private createHitPointsMessageComponent = (
    { hitPoints, id: characterId }: HitPoints,
    toEntityId: EntityId
  ) => {
    return new OutgoingMessage(
      this.newEntityId(),
      MESSAGE_TYPE.HITPOINTS,
      { characterId, hitPoints },
      toEntityId
    );
  };
}

export default CharacterConnected;
