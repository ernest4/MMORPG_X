import { Engine } from "../../shared/ecs";
import Buffer from "../../shared/utils/Buffer";
import System from "../../shared/ecs/System";
import uWS from "uWebSockets.js";
import { EntityId } from "../../shared/ecs/types";
import WebSocketInitEvent from "../components/WebSocketInitEvent";
import DisconnectionEvent from "../components/DisconnectionEvent";

class DisconnectionListener extends System {
  private _disconnections_buffer: Buffer<EntityId>;

  constructor(engine: Engine) {
    super(engine);
    this._disconnections_buffer = new Buffer<EntityId>();
  }

  start(): void {}

  update(): void {
    this.engine.query(this.registerDisconnectionListener, WebSocketInitEvent);
    this.engine.removeComponentsOfClass(DisconnectionEvent);
    this.createDisconnectionEvents();
  }

  destroy(): void {}

  private registerDisconnectionListener = ([{ behaviour, id }]: [WebSocketInitEvent]) => {
    behaviour.close = this.onClose(id);
  };

  private onClose = (entityId: EntityId) => {
    return (webSocket: uWS.WebSocket, code: number, message: ArrayBuffer) => {
      this._disconnections_buffer.push(entityId);
      console.log("WebSocket closed"); // TODO: remove
    };
  };

  private createDisconnectionEvents = () => {
    this._disconnections_buffer.process(entityId => {
      const disconnectionEvent = new DisconnectionEvent(entityId);
      this.engine.addComponents(disconnectionEvent);
    });
  };
}

export default DisconnectionListener;
