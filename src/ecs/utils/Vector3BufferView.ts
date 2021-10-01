const X_INDEX = 0;
const Y_INDEX = 1;
const Z_INDEX = 2;
class Vector3BufferView {
  private _values: Float32Array;

  constructor(values: ArrayBuffer, startByteOffset = 0) {
    // Extract ArrayBuffer out of TypedArray if values is not already ArrayBuffer
    const buffer = (values as Float32Array).buffer || values;
    // Float32Array will error out at runtime if it can't construct itself at the right size
    this._values = new Float32Array(buffer, startByteOffset, 3);
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
}

export default Vector3BufferView;
