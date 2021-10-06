import Component from "../../shared/ecs/Component";
import { EntityId } from "../../shared/ecs/types";

// TODO: optimize with ArrayBuffers ??
class WebSocketComponent extends Component {
  websocket: WebSocket;
  // type!: InputEventType;
  // key!: string;
  // processed: boolean;

  constructor(entityId: EntityId, websocket: WebSocket) {
    super(entityId);
    this.websocket = websocket;
  }
}

export default WebSocketComponent;
