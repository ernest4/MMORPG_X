import { Engine } from "../../shared/ecs";
import Buffer from "../../shared/ecs/utils/Buffer";
import { duplicateBuffer } from "../../shared/ecs/utils/arrayBuffer";
import System from "../../shared/ecs/System";
import MessageEvent from "../../shared/components/MessageEvent";

class MessageListener extends System {
  private _webSocket: WebSocket;
  private _messagesBuffer: Buffer<ArrayBuffer>;

  constructor(engine: Engine, webSocket: WebSocket) {
    super(engine);
    this._webSocket = webSocket;
    this._messagesBuffer = new Buffer<ArrayBuffer>();
  }

  start(): void {
    this.registerMessageListener();
  }

  update(): void {
    this.engine.removeComponentsOfClass(MessageEvent);
    this.createMessageEvents();
  }

  destroy(): void {}

  private registerMessageListener = () => {
    this._webSocket.onmessage = ({ data: binaryMessage }) => {
      // To combat Nagle algorithm, send back empty message right away
      // https://stackoverflow.com/a/19581883
      // this._webSocket.send(""); // empty, but still includes headers
      this._messagesBuffer.push(binaryMessage);
    };
  };

  private createMessageEvents = () => {
    this._messagesBuffer.process(binaryMessage => {
      const entityId = this.newEntityId();
      const clientMessageEvent = new MessageEvent(entityId, binaryMessage);
      this.engine.addComponents(clientMessageEvent);
    });
  };
}

export default MessageListener;
