import { Engine } from "../../shared/ecs";
import Buffer from "../../shared/utils/buffer";
import System from "../../shared/ecs/System";
import WebSocket from "../components/WebSocket";
import uWS from "uWebSockets.js";
import { EntityId } from "../../shared/ecs/types";
import WebSocketInitEvent from "../components/WebSocketInitEvent";
import MessageEvent from "../components/MessageEvent";
import { MESSAGE_TYPES } from "../../shared/messages/schema";
import Message from "../../shared/messages/Message";

const MESSAGE_COMPONENT_CLASSES = {
  [MESSAGE_TYPES.PING]: PingMessage,
  // TODO: the rest...
};

// MESSAGE_COMPONENT_CLASSES = {
//   Pulse::Messages::Move.to_s => Component::ClientMoveMessage,
// }
class MessageDeserializer extends System {
  constructor(engine: Engine) {
    super(engine);
  }

  start(): void {}

  update(): void {
    // this.engine.removeComponentsOfClasses(...Object.values(MESSAGE_COMPONENT_CLASSES));
    this.engine.query(this.createMessageComponents, MessageEvent);
  }

  destroy(): void {}

  private createMessageComponents = querySet => {
    const [messageEvent] = querySet as [MessageEvent];

    // TODO: the message class could do conversion to component right away??
    // TODO: then if Message can do that, then no need for MessageEvent components,
    // the MessageListener can just produce specific message components right away!
    const parsedMessage = new Message().parseBinary(messageEvent.binaryMessage);
    const messageComponent = new MESSAGE_COMPONENT_CLASSES[parsedMessage.type](
      this.engine.generateEntityId(),
      messageEvent.fromEntityId,
      parsedMessage
    );

    this.engine.addComponent(messageComponent);
  };
}

export default MessageDeserializer;
