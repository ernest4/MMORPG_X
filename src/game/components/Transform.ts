import Component from "../../ecs/Component";
import { EntityId } from "../../ecs/types";
import Vector3BufferView from "../../ecs/utils/Vector3BufferView";

class Transform extends Component {
  private _values: Float32Array;
  position: Vector3BufferView;
  rotation: Vector3BufferView;
  scale: Vector3BufferView;

  constructor(entityId: EntityId) {
    super(entityId, true);
    this._values = new Float32Array(9);
    this.position = new Vector3BufferView(this._values);
    this.rotation = new Vector3BufferView(this._values, 3 * 4);
    this.scale = new Vector3BufferView(this._values, 6 * 4);

    // TODO: hold the parent here ???
    // this._sparent = entityId;
    // when parent transform changes, child transform changes (thats how Unity does it)
    // get/set parent ???
    // this._children = entityId[]; ???
  }

  // NO METHODS IN COMPONENTS !!! (just put this in some util library or system...)
  // distanceTo = (position: Position): number => {
  //   // TODO: wip...
  // };
}

export default Transform;
