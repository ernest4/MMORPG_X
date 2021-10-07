import Component from "../../shared/ecs/Component";
import { EntityId } from "../../shared/ecs/types";
import uWS from "uWebSockets.js";

// TODO: optimize with ArrayBuffers ??
class WebSocketInitEvent extends Component {
  behaviour: uWS.WebSocketBehavior;

  constructor(entityId: EntityId) {
    super(entityId);
    this.behaviour = {};
  }
}

export default WebSocketInitEvent;
