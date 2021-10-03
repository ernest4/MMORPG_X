import { SERVER } from "../../utils/environment";
import { DeltaTime } from "../types";

const SERVER_FPS = 20;
const SERVER_TICK_LENGTH_MS = 1000 / SERVER_FPS;

class TickProvider {
  private _previousTimestamp: number = 0;
  private _animationFrameRequest: number | undefined;
  private _tickCallback: (deltaTime: DeltaTime) => any;
  private _previousTick: number; // SERVER

  constructor(tickCallback: (deltaTime: DeltaTime) => any) {
    this._tickCallback = tickCallback;
    this._previousTick = Date.now(); // SERVER
  }

  start = () => (SERVER ? this.startServer() : this.startClient());
  stop = () => (SERVER ? this.stopServer() : this.stopClient());
  tick = (timestamp: DeltaTime) => {
    SERVER ? this.tickServer() : this.tickClient(timestamp);
  };

  // SERVER
  // @ts-ignore
  startServer = () => this.tickServer();

  // @ts-ignore
  stopServer = () => {}; // wip

  tickServer = () => {
    let now = Date.now();

    if (this._previousTick + SERVER_TICK_LENGTH_MS <= now) {
      const deltaTime = (now - this._previousTick) / 1000;
      this._previousTick = now;
      this._tickCallback(deltaTime);
    }

    // Reason for this set up on Node.js server explained here:
    // https://timetocode.tumblr.com/post/71512510386/an-accurate-node-js-game-loop-inbetween-settimeout-and#notes
    if (Date.now() - this._previousTick < SERVER_TICK_LENGTH_MS - 16) setTimeout(this.tickServer, 0);
    else setImmediate(this.tickServer);
  };

  // CLIENT
  // @ts-ignore
  startClient = () => (this._animationFrameRequest = requestAnimationFrame(this.tick));

  // @ts-ignore
  stopClient = () => cancelAnimationFrame(this._animationFrameRequest as number);

  tickClient = (timestamp: DeltaTime) => {
    timestamp = timestamp || Date.now();

    const tmp = this._previousTimestamp || timestamp;
    this._previousTimestamp = timestamp;

    const deltaTime = (timestamp - tmp) * 0.001;

    this._tickCallback(deltaTime);

    // @ts-ignore
    requestAnimationFrame(this.tick);
  };
}

export default TickProvider;
