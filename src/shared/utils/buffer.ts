// TODO: specs
class Buffer<T> {
  private _buffer1: T[];
  private _buffer2: T[];
  private _activeBuffer: T[];
  private _secondaryBuffer: T[];

  constructor() {
    this._buffer1 = [];
    this._buffer2 = [];
    this._activeBuffer = this._buffer1;
    this._secondaryBuffer = this._buffer2;
  }

  push = (item: T) => this._activeBuffer.push(item);

  process = (callback: (item: T) => void) => {
    this.swap();
    this.each(callback);
    this.flush();
  };

  swap = () => {
    // TODO: is this really safe? Probably. JS is single threaded...
    const temp = this._activeBuffer;
    this._activeBuffer = this._secondaryBuffer;
    this._secondaryBuffer = temp;
  };

  flush = () => (this._secondaryBuffer = []);

  flushAll = () => {
    this._activeBuffer = [];
    this._secondaryBuffer = [];
  };

  each = (callback: (item: T) => void) => this._secondaryBuffer.forEach(callback);
}

export default Buffer;
