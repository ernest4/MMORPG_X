import ConnectionEvent from "../../shared/components/ConnectionEvent";
import WebSocketComponent from "../../client/components/WebSocket";
import { Engine } from "../../shared/ecs";
import System from "../../shared/ecs/System";
import { QuerySet } from "../../shared/ecs/types";

class ConnectionListener extends System {
  private _webSocket: WebSocket;
  private _connection_buffer: boolean = false;

  constructor(engine: Engine, webSocket: WebSocket) {
    super(engine);
    this._webSocket = webSocket;
  }

  start(): void {
    this._webSocket.onopen = this.onOpen;
  }

  update(): void {
    this.engine.query(this.removeConnectionEvents, ConnectionEvent);
    this.createConnectionEvents();
  }

  destroy(): void {}

  private onOpen = (event: Event) => (this._connection_buffer = true);

  private removeConnectionEvents = (querySet: QuerySet) => {
    const [connectionEvent] = querySet as [ConnectionEvent];
    this.engine.removeComponent(connectionEvent);
  };

  private createConnectionEvents = () => {
    const entityId = this.engine.generateEntityId();
    const connectionEvent = new ConnectionEvent(entityId);
    const webSocket = new WebSocketComponent(entityId, this._webSocket);
    this.engine.addComponents(connectionEvent, webSocket);

    this._connection_buffer = false;
  };
}

export default ConnectionListener;
