// PhysicsBody {
// mass: number
// linearDamping: number
// angularDamping: number
// linearVelocity: [x,y,z]
// angularVelocity: [x,y,z]
// gravityFactor: number
// }

import { EntityId } from "../../ecs/types";
import Component from "../../ecs/Component";
import Vector3BufferView from "../../ecs/utils/Vector3BufferView";

// TODO: optimize with ArrayBuffers
class PhysicsBody extends Component {
  private _values: Float32Array;
  linearVelocity: Vector3BufferView;
  angularVelocity: Vector3BufferView;

  // TODO: ...
  constructor(entityId: EntityId) {
    super(entityId, true);
    this._values = new Float32Array(6);
    this.linearVelocity = new Vector3BufferView(this._values);
    this.angularVelocity = new Vector3BufferView(this._values, 3 * 4);
  }
}

export default PhysicsBody;
