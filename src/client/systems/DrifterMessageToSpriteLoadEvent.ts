import ConnectionEvent from "../../shared/components/ConnectionEvent";
import WebSocketComponent from "../components/WebSocket";
import { Engine } from "../../shared/ecs";
import System from "../../shared/ecs/System";
import Buffer from "../../shared/utils/Buffer";
import Drifter from "../../shared/components/characterTypes/Drfiter";
import { DrifterMessage } from "../../shared/messages/schema";
import { QuerySet } from "../../shared/ecs/types";

class DrifterMessageToSpriteLoadEvent extends System {
  constructor(engine: Engine) {
    super(engine);
  }

  start(): void {}

  update(): void {
    // this.engine.removeComponentsOfClass(ConnectionEvent);
    // this.createConnectionEvents();
    this.engine.query(this.createSpriteLoadEvents, Drifter, DrifterMessage);
  }

  destroy(): void {}

  private createSpriteLoadEvents = (querySet: QuerySet) => {
    const [drifter, drifterMessage] = querySet as [Drifter, DrifterMessage];
    // TODO
    // 1. check if sprite exists for entity (aliased) that has Drifter component & drifter evevt
    // 2. if not, check if sprite load event exists, otherwise exit
    // 3. if not create sprite load event, otherwise exit
  };

  // private createConnectionEvents = () => {
  //   this._connectionsBuffer.process(isConnected => {
  //     const entityId = this.newEntityId();
  //     const connectionEvent = new ConnectionEvent(entityId);
  //     const webSocket = new WebSocketComponent(entityId, this._webSocket);
  //     this.engine.addComponents(connectionEvent, webSocket);
  //   });
  // };
}

export default DrifterMessageToSpriteLoadEvent;
