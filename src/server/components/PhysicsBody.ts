// PhysicsBody {
// mass: number
// linearDamping: number
// angularDamping: number
// linearVelocity: [x,y,z]
// angularVelocity: [x,y,z]
// gravityFactor: number
// }

import { EntityId } from "../../shared/ecs/types";
import Component from "../../shared/ecs/Component";
import Vector3BufferView, { Vector3Hash } from "../../shared/ecs/utils/Vector3BufferView";
import { FIELD_TYPE, FIELD_TYPES } from "../../shared/messages/schema";

const FLOAT_32_BYTES = FIELD_TYPES[FIELD_TYPE.FLOAT_32].bytes;

// TODO: optimize with ArrayBuffers
class PhysicsBody extends Component {
  private _values: Float32Array;
  linearVelocity: Vector3BufferView;
  angularVelocity: Vector3BufferView;

  // TODO: ...
  constructor(entityId: EntityId, linearVelocity?: Vector3Hash, angularVelocity?: Vector3Hash) {
    super(entityId);
    this._values = new Float32Array(6);
    this.linearVelocity = new Vector3BufferView(this._values, 0, linearVelocity);
    this.angularVelocity = new Vector3BufferView(this._values, 3 * FLOAT_32_BYTES, angularVelocity);
  }
}

export default PhysicsBody;
