import Component from "../../shared/ecs/Component";
import { EntityId } from "../../shared/ecs/types";
import uWS from "uWebSockets.js";

export const GUEST_UID_PREFIX = "guest-";

// TODO: optimize with ArrayBuffers ??
class WebSocket extends Component {
  websocket: uWS.WebSocket;

  constructor(entityId: EntityId, websocket: uWS.WebSocket) {
    super(entityId);
    this.websocket = websocket;
  }
}

export default WebSocket;
