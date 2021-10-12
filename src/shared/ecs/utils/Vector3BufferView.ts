const X_INDEX = 0;
const Y_INDEX = 1;
const Z_INDEX = 2;

export type Vector3Hash = { x: number; y: number; z: number };
class Vector3BufferView {
  private _values: Float32Array;

  constructor(arrayBuffer: ArrayBuffer, startByteOffset = 0, initialValues?: Vector3Hash) {
    // Extract ArrayBuffer out of TypedArray if values is not already ArrayBuffer
    const buffer = (arrayBuffer as Float32Array).buffer || arrayBuffer;
    // Float32Array will error out at runtime if it can't construct itself at the right size
    this._values = new Float32Array(buffer, startByteOffset, 3);

    // TODO: jests
    if (initialValues) this.initialize(initialValues);
  }

  get x() {
    return this._values[X_INDEX];
  }

  set x(value: number) {
    this._values[X_INDEX] = value;
  }

  get y() {
    return this._values[Y_INDEX];
  }

  set y(value: number) {
    this._values[Y_INDEX] = value;
  }

  get z() {
    return this._values[Z_INDEX];
  }

  set z(value: number) {
    this._values[Z_INDEX] = value;
  }

  get xyz(): Vector3Hash {
    const { x, y, z } = this;
    return { x, y, z };
  }

  set xyz({ x, y, z }: Vector3Hash) {
    this._values[X_INDEX] = x;
    this._values[Y_INDEX] = y;
    this._values[Z_INDEX] = z;
  }

  private initialize = (initialValues: Vector3Hash) => {
    this.x = initialValues.x;
    this.y = initialValues.y;
    this.z = initialValues.z;
  };
}

export default Vector3BufferView;
