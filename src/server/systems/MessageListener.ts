import { Engine } from "../../shared/ecs";
import Buffer from "../../shared/ecs/utils/Buffer";
import { duplicateBuffer } from "../../shared/ecs/utils/arrayBuffer";
import System from "../../shared/ecs/System";
import WebSocket from "../components/WebSocket";
import uWS from "uWebSockets.js";
import { EntityId } from "../../shared/ecs/types";
import WebSocketInitEvent from "../components/WebSocketInitEvent";
import MessageEvent from "../../shared/components/MessageEvent";

class MessageListener extends System {
  private _messagesBuffer: Buffer<{ fromEntityId: EntityId; binaryMessage: ArrayBuffer }>;

  constructor(engine: Engine) {
    super(engine);
    this._messagesBuffer = new Buffer<{ fromEntityId: EntityId; binaryMessage: ArrayBuffer }>();
  }

  start(): void {}

  update(): void {
    this.engine.query(this.registerMessageListener, WebSocketInitEvent);
    this.engine.removeComponentsOfClass(MessageEvent);
    this.createMessageEvents();
  }

  destroy(): void {}

  private registerMessageListener = ([{ behaviour, id }]: [WebSocketInitEvent]) => {
    behaviour.message = this.onMessage(id);
  };

  private onMessage = entityId => {
    return (webSocket: uWS.WebSocket, binaryMessage: ArrayBuffer, isBinary: boolean) => {
      /* Ok is false if backpressure was built up, wait for drain */
      // let ok = ws.send(message, isBinary);

      // # TODO: add message throttling mechanism here... ?!?

      // # TODO: moving this out of here...too its own system
      // # parsed_message = Pulse::Messages::Resolver.resolve(binaryMessage)
      // # new_message = Message.new(socket, parsed_message)

      this._messagesBuffer.push({
        fromEntityId: entityId,
        binaryMessage: duplicateBuffer(binaryMessage),
      });
    };
  };

  private createMessageEvents = () => {
    this._messagesBuffer.process(({ fromEntityId, binaryMessage }) => {
      const entityId = this.newEntityId();
      const clientMessageEvent = new MessageEvent(entityId, binaryMessage, fromEntityId);
      this.engine.addComponents(clientMessageEvent);
    });
  };
}

export default MessageListener;
