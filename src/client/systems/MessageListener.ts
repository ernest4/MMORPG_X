import { Engine } from "../../shared/ecs";
import Buffer from "../../shared/utils/buffer";
import System from "../../shared/ecs/System";
import { QuerySet } from "../../shared/ecs/types";
import ServerMessageEvent from "../components/ServerMessageEvent";

class MessageListener extends System {
  private _webSocket: WebSocket;
  private _messages_buffer: Buffer<ArrayBuffer>;

  constructor(engine: Engine, webSocket: WebSocket) {
    super(engine);
    this._webSocket = webSocket;
    this._messages_buffer = new Buffer<ArrayBuffer>();
  }

  start(): void {
    this.registerMessageListener();
  }

  update(): void {
    this.engine.removeComponentsOfClass(ServerMessageEvent);
    this.createClientMessageEvents();
  }

  destroy(): void {}

  private registerMessageListener = () => {
    this._webSocket.onmessage = ({ data: binaryMessage }) => {
      // To combat Nagle algorithm
      // https://stackoverflow.com/a/19581883
      this._webSocket.send(""); // empty, but still includes headers

      // cruft from other project
      // const parsedMessage = parse(event.data);
      // pushMessageToPhaserRegistry(scene, parsedMessage);

      this._messages_buffer.push(binaryMessage);
    };
  };

  private createClientMessageEvents = () => {
    this._messages_buffer.process(binaryMessage => {
      const entityId = this.engine.generateEntityId();
      const clientMessageEvent = new ServerMessageEvent(entityId, binaryMessage);
      this.engine.addComponents(clientMessageEvent);
    });
  };
}

export default MessageListener;
