import { DeltaTime } from "../types";

class TickProvider {
  private _previousTimestamp: number = 0;
  private _animationFrameRequest: number | undefined;
  private _tickCallback: (deltaTime: DeltaTime) => any;

  constructor(tickCallback: (deltaTime: DeltaTime) => any) {
    this._tickCallback = tickCallback;
  }

  start = () => (this._animationFrameRequest = requestAnimationFrame(this.tick));

  stop = () => cancelAnimationFrame(this._animationFrameRequest as number);

  tick = (timestamp: DeltaTime) => {
    timestamp = timestamp || Date.now();

    const tmp = this._previousTimestamp || timestamp;
    this._previousTimestamp = timestamp;

    const deltaTime = (timestamp - tmp) * 0.001;

    this._tickCallback(deltaTime);

    requestAnimationFrame(this.tick);
  };
}

export default TickProvider;
