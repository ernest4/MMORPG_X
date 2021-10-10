import { Engine } from "../../shared/ecs";
import Buffer from "../../shared/utils/Buffer";
import System from "../../shared/ecs/System";
import WebSocket, { GUEST_UID_PREFIX } from "../components/WebSocket";
import ConnectionEvent from "../../shared/components/ConnectionEvent";
import uWS from "uWebSockets.js";
import WebSocketInitEvent from "../components/WebSocketInitEvent";
import { EntityId } from "../../shared/ecs/types";

class ConnectionListener extends System {
  // private _connections_buffer: Buffer<{ socket: uWS.WebSocket; context: uWS.us_socket_context_t }>;
  private _connections_buffer: Buffer<{ entityId: EntityId; webSocket: uWS.WebSocket }>;

  constructor(engine: Engine) {
    super(engine);
    // this._connections_buffer = new Buffer<{
    //   webSocket: uWS.WebSocket;
    //   context: uWS.us_socket_context_t;
    // }>();
    this._connections_buffer = new Buffer<{ entityId: EntityId; webSocket: uWS.WebSocket }>();
  }

  start(): void {}

  update(): void {
    this.engine.query(this.registerConnectionListener, WebSocketInitEvent);
    this.engine.removeComponentsOfClass(ConnectionEvent);
    this.createConnectionEvents();
  }

  destroy(): void {}

  private registerConnectionListener = querySet => {
    const [webSocketInitEvent] = querySet as [WebSocketInitEvent];
    webSocketInitEvent.behaviour.upgrade = this.onUpgrade(webSocketInitEvent.id);
    webSocketInitEvent.behaviour.open = this.onOpen(webSocketInitEvent.id);
  };

  private onUpgrade = entityId => {
    return (res, req, context) => {
      // try {
      //   req.user = decodeJwtCookie(req, "cookieName");
      // } catch {
      //   return res.writeStatus("401").end();
      // }
      // res.upgrade(
      //   { uid: req.user._id },
      //   req.getHeader("sec-websocket-key"),
      //   req.getHeader("sec-websocket-protocol"),
      //   req.getHeader("sec-websocket-extensions"),
      //   context
      // );

      // try {
      //   req.user = decodeJwtCookie(req, "cookieName");
      // } catch {
      //   return res.writeStatus("401").end();
      // }

      // NOTE: uid will be for auth / DB lookup. Guest / google_id
      res.upgrade(
        { uid: `${GUEST_UID_PREFIX}${entityId}` },
        req.getHeader("sec-websocket-key"),
        req.getHeader("sec-websocket-protocol"),
        req.getHeader("sec-websocket-extensions"),
        context
      );
      console.log("A WebSocket upgraded!"); // TODO: remove
    };
  };

  private onOpen = entityId => {
    return (webSocket: uWS.WebSocket) => {
      this._connections_buffer.push({ entityId, webSocket });
      console.log(`A WebSocket connected! ws.uid:${webSocket.uid}`); // TODO: remove
    };
  };

  private createConnectionEvents = () => {
    this._connections_buffer.process(({ entityId, webSocket: bufferedWebSocket }) => {
      const connectionEvent = new ConnectionEvent(entityId);
      const webSocket = new WebSocket(entityId, bufferedWebSocket);
      this.engine.addComponents(connectionEvent, webSocket);
    });
  };
}

export default ConnectionListener;
