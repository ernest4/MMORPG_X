import { Engine } from "../ecs";
import System from "../ecs/System";
import SCHEMA, { MESSAGE_COMPONENT_CLASSES_LIST } from "../messages/schema";
import Reader from "../messages/schema/Reader";
import MessageEvent from "../components/MessageEvent";

class MessageDeserializer extends System {
  private _reader: Reader;

  constructor(engine: Engine) {
    super(engine);
    this._reader = new Reader(SCHEMA);
  }

  start(): void {}

  update(): void {
    this.engine.removeComponentsOfClasses(...MESSAGE_COMPONENT_CLASSES_LIST);
    this.engine.query(this.createMessageComponents, MessageEvent);
  }

  destroy(): void {}

  private createMessageComponents = ([{ fromEntityId, binaryMessage }]: [MessageEvent]) => {
    const entityId = this.newEntityId();
    const messageComponent = this._reader.binaryToMessageComponent(
      entityId,
      binaryMessage,
      fromEntityId
    );
    // debugging
    console.log(messageComponent.parsedMessage);
    this.engine.addComponent(messageComponent);
  };
}

export default MessageDeserializer;
