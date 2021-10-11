import ConnectionEvent from "../../shared/components/ConnectionEvent";
import Transform from "../../shared/components/Transform";
import { Engine } from "../../shared/ecs";
import System from "../../shared/ecs/System";
import { EntityId } from "../../shared/ecs/types";
import { SparseSetItem } from "../../shared/ecs/utils/SparseSet";
import Name from "../../shared/components/Name";
import NearbyCharacters from "../components/NearbyCharacters";
import OutgoingMessage from "../components/OutgoingMessage";
import Room from "../components/Room";
import State from "../game/State";

const queryComponents = [ConnectionEvent, Name, Transform, Room, NearbyCharacters];
type ComponentsSet = [ConnectionEvent, Name, Transform, Room, NearbyCharacters];
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
    const [connectionEvent, name, transform, room, nearbyCharacters] = querySet;

    // TODO: future 'Entity' API sample: ...
    // const entity = this.engine.getEntity(connectionEvent.id);
    // const components = entity.getComponents(...queryComponents) as ComponentsSet;
    // OR? const components = entity.getComponents<ComponentsSet>(...queryComponents);

    let serverMessageComponents: OutgoingMessage[] = [];
    const newCharacterEntityId = connectionEvent.id;

    const messagesToInformCharacterOfSelf = this.messagesToInformNewCharacterOfSelf(
      room,
      name,
      transform
    );
    serverMessageComponents = [...serverMessageComponents, ...messagesToInformCharacterOfSelf];

    nearbyCharacters.entityIdsSet.stream(({ id: nearbyCharacterEntityId }: SparseSetItem) => {
      const messagesToNearbyCharacter = this.messagesToInformOneCharacterOfAnother(
        name,
        transform,
        nearbyCharacterEntityId
      );

      const nearbyCharacterName = this.engine.getComponent<Name>(Name, nearbyCharacterEntityId);
      const nearbyCharacterTransform = this.engine.getComponent<Transform>(
        Transform,
        nearbyCharacterEntityId
      );
      const messagesToNewCharacter = this.messagesToInformOneCharacterOfAnother(
        nearbyCharacterName,
        nearbyCharacterTransform,
        newCharacterEntityId
      );

      serverMessageComponents = [
        ...serverMessageComponents,
        ...messagesToNearbyCharacter,
        ...messagesToNewCharacter,
      ];
    });

    this.engine.addComponents(...serverMessageComponents);
  };

  private messagesToInformNewCharacterOfSelf = (room: Room, name: Name, transform: Transform) => {
    return [
      this.createRoomInitMessageComponent(room, room.id),
      this.createConnectedMessageComponent(name, name.id),
      this.createPositionMessageComponent(transform, transform.id),
    ];
  };

  private messagesToInformOneCharacterOfAnother = (
    name: Name,
    transform: Transform,
    toEntityId
  ) => {
    return [
      this.createConnectedMessageComponent(name, toEntityId),
      this.createPositionMessageComponent(transform, toEntityId),
    ];
  };

  private createRoomInitMessageComponent = ({ roomName }: Room, toEntityId: EntityId) => {
    const { tileSizeInPx, widthInTiles, heightInTiles, tiles } = this._state.rooms[roomName];
    const parsedMessage = { tileSizeInPx, widthInTiles, heightInTiles, tiles };
    return new OutgoingMessage(this.engine.generateEntityId(), parsedMessage, toEntityId);
  };

  private createConnectedMessageComponent = (
    { name: characterName, id: characterId }: Name,
    toEntityId: EntityId
  ) => {
    const parsedMessage = { characterId, characterName };
    return new OutgoingMessage(this.engine.generateEntityId(), parsedMessage, toEntityId);
  };

  private createPositionMessageComponent = (
    { position, id: characterId }: Transform,
    toEntityId: EntityId
  ) => {
    const parsedMessage = { characterId, ...position.xyz };
    return new OutgoingMessage(this.engine.generateEntityId(), parsedMessage, toEntityId);
  };
}

export default CharacterConnected;
