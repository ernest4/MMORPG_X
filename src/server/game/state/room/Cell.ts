import { EntityId } from "../../../../shared/ecs/types";
import SparseSet, { SparseSetItem } from "../../../../shared/ecs/utils/SparseSet";

// TODO: jests
class Cell {
  private _characters: SparseSet;

  constructor() {
    this._characters = new SparseSet();
  }

  addCharacter = (entityId: EntityId) => {
    this._characters.add(new SparseSetItem(entityId));
  };

  removeCharacter = (entityId: EntityId) => {
    this._characters.remove(entityId);
  };

  streamCharacterIds = (callback: (EntityId) => void) => {
    // NOTE: more efficient to memoize the function here than on each stream() callback
    const sparseSetItemCallback = ({ id }) => callback(id);
    this._characters.stream(sparseSetItemCallback);
  };
}

export default Cell;
