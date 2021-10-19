import { Engine } from "../../shared/ecs";
import System from "../../shared/ecs/System";
import uWS from "uWebSockets.js";
import WebSocketInitEvent from "../components/WebSocketInitEvent";

class WebSocketInitializer extends System {
  private _server: uWS.TemplatedApp;

  constructor(engine: Engine, server: uWS.TemplatedApp) {
    super(engine);
    this._server = server;
  }

  start(): void {
    const entityId = this.newEntityId();
    this.engine.addComponent(new WebSocketInitEvent(entityId));
    // this.engine.generateComponent(WebSocketInitEvent) // TODO: engine helper
  }

  update(): void {
    this.engine.query(this.initWebSocket, WebSocketInitEvent);
  }

  destroy(): void {}

  private initWebSocket = ([{ id, behaviour }]: [WebSocketInitEvent]) => {
    if (!behaviour.upgrade || !behaviour.open || !behaviour.close) return;

    this._server.ws("/", {
      /* Options */
      // compression: uWS.SHARED_COMPRESSOR,
      // maxPayloadLength: 16 * 1024 * 1024,
      // idleTimeout: 10,
      /* Handlers */
      ...behaviour,
      // drain: (ws: uWS.WebSocket) => {
      //   console.log("WebSocket backpressure: " + ws.getBufferedAmount());
      // },
    });
    this.engine.removeComponentById(id, WebSocketInitEvent);
  };
}

export default WebSocketInitializer;
