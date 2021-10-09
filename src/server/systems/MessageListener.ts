import { Engine } from "../../shared/ecs";
import Buffer from "../../shared/utils/Buffer";
import System from "../../shared/ecs/System";
import WebSocket from "../components/WebSocket";
import uWS from "uWebSockets.js";
import { EntityId } from "../../shared/ecs/types";
import WebSocketInitEvent from "../components/WebSocketInitEvent";
import MessageEvent from "../components/MessageEvent";

class MessageListener extends System {
  private _messages_buffer: Buffer<{ fromEntityId: EntityId; binaryMessage: ArrayBuffer }>;

  constructor(engine: Engine) {
    super(engine);
    this._messages_buffer = new Buffer<{ fromEntityId: EntityId; binaryMessage: ArrayBuffer }>();
  }

  start(): void {}

  update(): void {
    this.engine.query(this.registerMessageListener, WebSocketInitEvent);
    this.engine.removeComponentsOfClass(MessageEvent);
    this.createMessageEvents();
  }

  destroy(): void {}

  private registerMessageListener = querySet => {
    const [webSocketInitEvent] = querySet as [WebSocketInitEvent];
    webSocketInitEvent.behaviour.message = this.onMessage(webSocketInitEvent.id);
  };

  private onMessage = entityId => {
    return (webSocket: uWS.WebSocket, binaryMessage: ArrayBuffer, isBinary: boolean) => {
      /* Ok is false if backpressure was built up, wait for drain */
      // let ok = ws.send(message, isBinary);

      // # TODO: add message throttling mechanism here... ?!?

      // # TODO: moving this out of here...too its own system
      // # parsed_message = Pulse::Messages::Resolver.resolve(binaryMessage)
      // # new_message = Message.new(socket, parsed_message)

      this._messages_buffer.push({ fromEntityId: entityId, binaryMessage: binaryMessage });
    };
  };

  private createMessageEvents = () => {
    this._messages_buffer.process(({ fromEntityId, binaryMessage }) => {
      const entityId = this.engine.generateEntityId();
      const clientMessageEvent = new MessageEvent(entityId, fromEntityId, binaryMessage);
      this.engine.addComponents(clientMessageEvent);
    });
  };
}

export default MessageListener;
