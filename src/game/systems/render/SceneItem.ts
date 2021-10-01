import { EntityId } from "../../../ecs/types";
import { SparseSetItem } from "../../../ecs/utils/SparseSet";

class SceneItem<T> extends SparseSetItem {
  private _itemRef: T;
  processed: boolean;

  constructor(entityId: EntityId, itemRef: T) {
    super(entityId);
    this._itemRef = itemRef;
    this.processed = false;
  }

  get itemRef() {
    return this._itemRef;
  }
}

export default SceneItem;
