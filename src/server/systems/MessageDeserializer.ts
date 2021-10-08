import { Engine } from "../../shared/ecs";
import System from "../../shared/ecs/System";
import MessageEvent from "../components/MessageEvent";
import Message, { MESSAGE_COMPONENT_CLASSES } from "../../shared/messages/Message";

const MESSAGE_COMPONENT_CLASSES_ARRAY = Object.values(MESSAGE_COMPONENT_CLASSES);

class MessageDeserializer extends System {
  constructor(engine: Engine) {
    super(engine);
  }

  start(): void {}

  update(): void {
    this.engine.removeComponentsOfClasses(...MESSAGE_COMPONENT_CLASSES_ARRAY);
    this.engine.query(this.createMessageComponents, MessageEvent);
  }

  destroy(): void {}

  private createMessageComponents = querySet => {
    const [{ fromEntityId, binaryMessage }] = querySet as [MessageEvent];
    const entityId = this.engine.generateEntityId();
    const messageComponent = new Message().binaryToComponent(entityId, fromEntityId, binaryMessage);
    this.engine.addComponent(messageComponent);
  };
}

export default MessageDeserializer;
