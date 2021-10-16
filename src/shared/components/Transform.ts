import { EntityId } from "../../shared/ecs/types";
import Vector3BufferView, { Vector3Hash } from "../../shared/ecs/utils/Vector3BufferView";
import { FIELD_TYPE, FIELD_TYPES, Float32, Int32, MESSAGE_TYPE } from "../messages/schema";
import Networked from "./Networked";

const FLOAT_32_BYTES = FIELD_TYPES[FIELD_TYPE.FLOAT_32].bytes;

class Transform extends Networked<MESSAGE_TYPE.TRANSFORM> {
  private _values: Float32Array;
  position: Vector3BufferView;
  rotation: Vector3BufferView;
  scale: Vector3BufferView;

  constructor(
    entityId: EntityId,
    position?: Vector3Hash,
    rotation?: Vector3Hash,
    scale?: Vector3Hash
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

  get parsedMessage(): { x: Float32; y: Float32; z: Float32; characterId: Int32 } {
    throw new Error("Method not implemented.");
  }
}

export default Transform;
