import ConnectionEvent from "../../shared/components/ConnectionEvent";
import WebSocketComponent from "../../client/components/WebSocket";
import { Engine } from "../../shared/ecs";
import System from "../../shared/ecs/System";
import Buffer from "../../shared/utils/buffer";

class ConnectionListener extends System {
  private _webSocket: WebSocket;
  private _connections_buffer: Buffer<boolean>;

  constructor(engine: Engine, webSocket: WebSocket) {
    super(engine);
    this._webSocket = webSocket;
    this._connections_buffer = new Buffer<boolean>();
  }

  start(): void {
    this._webSocket.onopen = this.onOpen;
  }

  update(): void {
    this.engine.removeComponentsOfClass(ConnectionEvent);
    this.createConnectionEvents();
  }

  destroy(): void {}

  private onOpen = (event: Event) => this._connections_buffer.push(true);

  private createConnectionEvents = () => {
    this._connections_buffer.process(isConnected => {
      const entityId = this.engine.generateEntityId();
      const connectionEvent = new ConnectionEvent(entityId);
      const webSocket = new WebSocketComponent(entityId, this._webSocket);
      this.engine.addComponents(connectionEvent, webSocket);
    });
  };
}

export default ConnectionListener;
