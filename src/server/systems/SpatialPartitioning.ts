import Transform from "../../shared/components/Transform";
import { Engine } from "../../shared/ecs";
import System from "../../shared/ecs/System";
import { EntityId, QuerySet } from "../../shared/ecs/types";
import SparseSet, { SparseSetItem } from "../../shared/ecs/utils/SparseSet";
import NearbyCharacters from "../components/NearbyCharacters";
import RoomComponent from "../components/Room";
import State from "../game/State";
import Room from "../game/state/Room";

// TODO: this is expensive operation, should rate limit it to 2-4 times per second, regardless
// server FPS !!
class SpatialPartitioning extends System {
  private _state: State;

  constructor(engine: Engine, state: State) {
    super(engine);
    this._state = state;
  }

  start(): void {}

  update(): void {
    this.engine.query(this.updateRoomAndCharacters, RoomComponent, Transform);
  }

  destroy(): void {}

  private updateRoomAndCharacters = (querySet: QuerySet) => {
    const [{ roomName }, transform] = querySet as [RoomComponent, Transform];
    const currentRoom = this._state.rooms[roomName];
    currentRoom.update(transform);
    this.updateNearbyCharacters(currentRoom, transform);
  };

  private updateNearbyCharacters = (
    currentRoom: Room,
    { position: { x, y }, id: currentEntityId }: Transform
  ) => {
    const nearbyCharacters = this.getOrCreateNearbyCharactersComponent(currentEntityId);
    const newEntityIdsSet = new SparseSet();
    // NOTE: memoizing
    const checkNearbyCharacterEntityId = (nearbyEntityId: EntityId) => {
      if (nearbyEntityId === currentEntityId) return;
      newEntityIdsSet.add(new SparseSetItem(nearbyEntityId));
    };
    currentRoom.streamNearbyCharacterEntityIds(x, y, checkNearbyCharacterEntityId);
    nearbyCharacters.entityIdsSet = newEntityIdsSet;
  };

  private getOrCreateNearbyCharactersComponent = (entityId: EntityId): NearbyCharacters => {
    const nearbyCharacters = this.engine.getComponent<NearbyCharacters>(NearbyCharacters, entityId);
    if (!nearbyCharacters) return this.engine.addComponent(new NearbyCharacters(entityId));
    return nearbyCharacters;
  };
}

export default SpatialPartitioning;
