import { Engine } from "../../shared/ecs";
import System from "../../shared/ecs/System";
import { QuerySet } from "../../shared/ecs/types";
import Buffer from "../../shared/ecs/utils/Buffer";
import DisconnectionEvent from "../components/DisconnectionEvent";

class DisconnectionListener extends System {
  private _webSocket: WebSocket;
  private _disconnectionsBuffer: Buffer<boolean>;

  constructor(engine: Engine, webSocket: WebSocket) {
    super(engine);
    this._webSocket = webSocket;
    this._disconnectionsBuffer = new Buffer<boolean>();
  }

  start(): void {
    this._webSocket.onclose = this.onClose;
  }

  update(): void {
    this.engine.removeComponentsOfClass(DisconnectionEvent);
    this.createDisconnectionEvents();
  }

  destroy(): void {}

  private onClose = (event: Event) => this._disconnectionsBuffer.push(true);

  private createDisconnectionEvents = () => {
    this._disconnectionsBuffer.process(isDisconnected => {
      const entityId = this.newEntityId();
      const disconnectionEvent = new DisconnectionEvent(entityId);
      this.engine.addComponent(disconnectionEvent);
      // this.engine.generateComponent(DisconnectionEvent) // could do all 3 steps above (and return component) // TODO
    });
  };
}

export default DisconnectionListener;
