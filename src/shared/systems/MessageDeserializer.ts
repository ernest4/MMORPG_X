import { Engine } from "../ecs";
import System from "../ecs/System";
import { MESSAGE_COMPONENT_CLASSES_LIST } from "../messages/schema";
import Reader from "../messages/schema/Reader";
import MessageEvent from "../components/MessageEvent";

class MessageDeserializer extends System {
  constructor(engine: Engine) {
    super(engine);
  }

  start(): void {}

  update(): void {
    this.engine.removeComponentsOfClasses(...MESSAGE_COMPONENT_CLASSES_LIST);
    this.engine.query(this.createMessageComponents, MessageEvent);
  }

  destroy(): void {}

  private createMessageComponents = ([{ fromEntityId, binaryMessage }]: [MessageEvent]) => {
    const entityId = this.newEntityId();
    const messageComponent = Reader.binaryToMessageComponent(entityId, binaryMessage, fromEntityId);
    this.log(messageComponent); // TODO: remove
    this.engine.addComponent(messageComponent);
  };
}

export default MessageDeserializer;
