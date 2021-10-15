import ConnectionEvent from "../../shared/components/ConnectionEvent";
import Transform from "../../shared/components/Transform";
import { Engine } from "../../shared/ecs";
import System from "../../shared/ecs/System";
import { EntityId } from "../../shared/ecs/types";
import { SparseSetItem } from "../../shared/ecs/utils/SparseSet";
import Name from "../../shared/components/Name";
import Type from "../../shared/components/Type";
import NearbyCharacters from "../components/NearbyCharacters";
import OutgoingMessage from "../components/OutgoingMessage";
import Room from "../components/Room";
import State from "../game/State";
import HitPoints from "../../shared/components/HitPoints";
import CharacterConnectedComponent from "../../shared/components/message/CharacterConnected";
import { MESSAGE_TYPES } from "../../shared/messages/schema";

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

    this.engine.addComponents(...serverMessageComponents);
  };

  private createRoomInitMessageComponent = ({ roomName }: Room, toEntityId: EntityId) => {
    const { tileSizeInPx, widthInTiles, heightInTiles, tiles } = this._state.rooms[roomName];
    const parsedMessage = { tileSizeInPx, widthInTiles, heightInTiles, tiles };
    return new OutgoingMessage(this.engine.generateEntityId(), parsedMessage, toEntityId);
  };

  private createConnectedMessageComponent = (
    { id: characterId, name: characterName }: Name,
    { type }: Type,
    toEntityId: EntityId
  ) => {
    return new OutgoingMessage<typeof MESSAGE_TYPES.CHARACTER_CONNECTED>(
      this.engine.generateEntityId(),
      { characterId, characterName, characterType: <number>type },
      toEntityId
    );
  };

  private createPositionMessageComponent = (
    { position, id: characterId }: Transform,
    toEntityId: EntityId
  ) => {
    const parsedMessage = { characterId, ...position.xyz };

    // TODO: typeof MESSAGE_TYPES.POSITION
    return new OutgoingMessage(this.engine.generateEntityId(), parsedMessage, toEntityId);
  };

  private createHitPointsMessageComponent = (
    { hitPoints, id: characterId }: HitPoints,
    toEntityId: EntityId
  ) => {
    const parsedMessage = { characterId, hitPoints };
    // TODO: typeof MESSAGE_TYPES.HITPOINTS
    return new OutgoingMessage(this.engine.generateEntityId(), parsedMessage, toEntityId);
  };
}

export default CharacterConnected;
