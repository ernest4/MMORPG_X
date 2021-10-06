import Component from "../../shared/ecs/Component";
import { EntityId } from "../../shared/ecs/types";
import uWS from "uWebSockets.js";

// TODO: optimize with ArrayBuffers ??
class WebSocket extends Component {
  websocket: uWS.WebSocket;
  // type!: InputEventType;
  // key!: string;
  // processed: boolean;

  constructor(entityId: EntityId, websocket: uWS.WebSocket) {
    super(entityId);
    this.websocket = websocket;
  }
}

export default WebSocket;
