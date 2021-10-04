import { Engine } from "../../shared/ecs";
import System from "../../shared/ecs/System";
import uWS from "uWebSockets.js";

class ConnectionListener extends System {
  private _server: uWS.TemplatedApp;

  constructor(engine: Engine, server: uWS.TemplatedApp) {
    super(engine);
    this._server = server;
  }

  start(): void {
    // TODO: ...
    // this._server.ws();
  }

  update(): void {}

  destroy(): void {}
}

export default ConnectionListener;
