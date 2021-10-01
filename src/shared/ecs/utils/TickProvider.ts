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

    // TODO: node.js does not have requestAnimationFrame, so need to detect which
    // env im in (client or server) and use the right methods
    // use the TickProvider sample from node.js below
    requestAnimationFrame(this.tick);
  };
}

export default TickProvider;


// node.js TickProvider sample

// type DeltaTime = number; // ms

// const FPS = 20;
// const TICK_LENGTH_MS = 1000 / FPS;

// exports.TickProvider = class {
//   // private _animationFrameRequest: number | undefined;
//   private _tickCallback: (deltaTime: DeltaTime) => any;
//   private _previousTick: number;

//   constructor(tickCallback: (deltaTime: DeltaTime) => any) {
//     this._tickCallback = tickCallback;
//     this._previousTick = Date.now();
//   }

//   start = () => this.tick();

//   // stop = () => cancelAnimationFrame(this._animationFrameRequest as number);

//   tick = () => {
//     let now = Date.now();

//     if (this._previousTick + TICK_LENGTH_MS <= now) {
//       const deltaTime = (now - this._previousTick) / 1000;
//       this._previousTick = now;
//       this._tickCallback(deltaTime);
//     }

//     // Reason for this set up on Node.js server explained here:
//     // https://timetocode.tumblr.com/post/71512510386/an-accurate-node-js-game-loop-inbetween-settimeout-and#notes
//     if (Date.now() - this._previousTick < TICK_LENGTH_MS - 16) setTimeout(this.tick);
//     else setImmediate(this.tick);
//   };
// };
