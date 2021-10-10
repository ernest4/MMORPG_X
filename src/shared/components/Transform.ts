import Component from "../../shared/ecs/Component";
import { EntityId } from "../../shared/ecs/types";
import Vector3BufferView, { VectorHash } from "../../shared/ecs/utils/Vector3BufferView";
import { FIELD_TYPES, FIELD_TYPE_BYTES } from "../messages/schema";

const FLOAT_32_BYTES = FIELD_TYPE_BYTES[FIELD_TYPES.FLOAT_32];

class Transform extends Component {
  private _values: Float32Array;
  position: Vector3BufferView;
  rotation: Vector3BufferView;
  scale: Vector3BufferView;

  constructor(
    entityId: EntityId,
    position?: VectorHash,
    rotation?: VectorHash,
    scale?: VectorHash
  ) {
    super(entityId);
    this._values = new Float32Array(9);
    this.position = new Vector3BufferView(this._values, 0, position);
    this.rotation = new Vector3BufferView(this._values, 3 * FLOAT_32_BYTES, rotation);
    this.scale = new Vector3BufferView(this._values, 6 * FLOAT_32_BYTES, scale);

    // TODO: hold the parent here ???
    // this._sparent = entityId;
    // when parent transform changes, child transform changes (thats how Unity does it)
    // get/set parent ???
    // this._children = entityId[]; ???
  }
}

export default Transform;
