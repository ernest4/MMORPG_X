// const { DeltaTime } = require("../../src/ecs/types"); // not work :/

type DeltaTime = number; // ms

const FPS = 20;
const TICK_LENGTH_MS = 1000 / FPS;

exports.TickProvider = class {
  // private _animationFrameRequest: number | undefined;
  private _tickCallback: (deltaTime: DeltaTime) => any;
  private _previousTick: number;

  constructor(tickCallback: (deltaTime: DeltaTime) => any) {
    this._tickCallback = tickCallback;
    this._previousTick = Date.now();
  }

  start = () => this.tick();

  // stop = () => cancelAnimationFrame(this._animationFrameRequest as number);

  tick = () => {
    let now = Date.now();

    if (this._previousTick + TICK_LENGTH_MS <= now) {
      const deltaTime = (now - this._previousTick) / 1000;
      this._previousTick = now;
      this._tickCallback(deltaTime);
    }

    // Reason for this set up on Node.js server explained here:
    // https://timetocode.tumblr.com/post/71512510386/an-accurate-node-js-game-loop-inbetween-settimeout-and#notes
    if (Date.now() - this._previousTick < TICK_LENGTH_MS - 16) setTimeout(this.tick);
    else setImmediate(this.tick);
  };
};
