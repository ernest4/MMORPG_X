import { Engine } from "../../shared/ecs";
import Buffer from "../../shared/utils/buffer";
import System from "../../shared/ecs/System";
import uWS from "uWebSockets.js";

class ConnectionListener extends System {
  private _server: uWS.TemplatedApp;
  private _connections_buffer: Buffer<{ socket: uWS.WebSocket; context: uWS.us_socket_context_t }>;

  constructor(engine: Engine, server: uWS.TemplatedApp) {
    super(engine);
    this._server = server;
    this._connections_buffer = new Buffer<{
      socket: uWS.WebSocket;
      context: uWS.us_socket_context_t;
    }>();
  }

  start(): void {
    // TODO: ...
    // this._server.ws();
  }

  update(): void {}

  destroy(): void {}
}

export default ConnectionListener;
