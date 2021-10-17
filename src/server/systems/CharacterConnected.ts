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
import Networked from "../../shared/components/Networked";
import Character from "../../shared/components/Character";

const queryComponents = [
  ConnectionEvent,
  Character,
  Name,
  Type,
  HitPoints,
  Transform,
  Room,
  NearbyCharacters,
] as const;

type ComponentsSet = [
  ConnectionEvent,
  Character,
  Name,
  Type,
  HitPoints,
  Transform,
  Room,
  NearbyCharacters
];
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

  private createServerMessages = (querySet: QuerySet) => {
    const [connectionEvent, character, name, type, hitPoints, transform, room, nearbyCharacters] =
      querySet as ComponentsSet;

    // TODO: future 'Entity' API sample: ...
    // const entity = this.engine.getEntity(connectionEvent.id);
    // const components = entity.getComponents(...queryComponents) as ComponentsSet;
    // OR? const components = entity.getComponents<ComponentsSet>(...queryComponents);

    let outMessageComponents: OutMessage<any>[] = [];
    const newCharacterId = connectionEvent.id;

    outMessageComponents = [
      // TODO: convert this to newOutMessage ??!?
      this.createRoomInitMessageComponent(room, newCharacterId),
      ...this.newOutMessages([character, name, type, hitPoints, transform]),
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

      outMessageComponents = [
        ...outMessageComponents,
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
}

export default CharacterConnected;
