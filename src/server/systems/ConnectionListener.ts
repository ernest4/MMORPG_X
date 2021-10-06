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
    // NOTE: wish I could separate this out into its own system per event like in the other server,
    // but the way uWS handles these, can't be done cleanly.

    // TODO: NO, find a way to split them out!
    this._server.ws("/play", {
      /* Options */
      // compression: uWS.SHARED_COMPRESSOR,
      // maxPayloadLength: 16 * 1024 * 1024,
      // idleTimeout: 10,
      /* Handlers */
      // upgrade: (res, req, context) => {
      //   try {
      //     req.user = decodeJwtCookie(req, "cookieName");
      //   } catch {
      //     return res.writeStatus("401").end();
      //   }
      //   res.upgrade(
      //     { uid: req.user._id },
      //     req.getHeader("sec-websocket-key"),
      //     req.getHeader("sec-websocket-protocol"),
      //     req.getHeader("sec-websocket-extensions"),
      //     context
      //   );
      // },
      open: (ws: uWS.WebSocket) => {
        console.log("A WebSocket connected!");
      },
      message: (ws: uWS.WebSocket, message: ArrayBuffer, isBinary: boolean) => {
        /* Ok is false if backpressure was built up, wait for drain */
        let ok = ws.send(message, isBinary);
      },
      drain: (ws: uWS.WebSocket) => {
        console.log("WebSocket backpressure: " + ws.getBufferedAmount());
      },
      close: (ws: uWS.WebSocket, code: number, message: ArrayBuffer) => {
        console.log("WebSocket closed");
      },
    });
  }

  update(): void {}

  destroy(): void {}
}

export default ConnectionListener;
