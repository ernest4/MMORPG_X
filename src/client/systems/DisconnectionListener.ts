import { Engine } from "../../shared/ecs";
import System from "../../shared/ecs/System";
import { QuerySet } from "../../shared/ecs/types";
import Buffer from "../../shared/utils/buffer";
import DisconnectionEvent from "../components/DisconnectionEvent";

class DisconnectionListener extends System {
  private _webSocket: WebSocket;
  private _disconnections_buffer: Buffer<boolean>;

  constructor(engine: Engine, webSocket: WebSocket) {
    super(engine);
    this._webSocket = webSocket;
    this._disconnections_buffer = new Buffer<boolean>();
  }

  start(): void {
    this._webSocket.onclose = this.onClose;
  }

  update(): void {
    this.engine.removeComponentsOfClass(DisconnectionEvent);
    this.createDisconnectionEvents();
  }

  destroy(): void {}

  private onClose = (event: Event) => this._disconnections_buffer.push(true);

  private createDisconnectionEvents = () => {
    this._disconnections_buffer.process(isDisconnected => {
      const entityId = this.engine.generateEntityId();
      const disconnectionEvent = new DisconnectionEvent(entityId);
      this.engine.addComponent(disconnectionEvent);
      // this.engine.generateComponent(DisconnectionEvent) // could do all 3 steps above (and return component) // TODO
    });
  };
}

export default DisconnectionListener;
