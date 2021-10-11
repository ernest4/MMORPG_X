import { Engine } from "../ecs";
import System from "../ecs/System";
import { MESSAGE_COMPONENT_CLASSES } from "../messages/schema";
import Reader from "../messages/message/Reader";
import MessageEvent from "../components/MessageEvent";

class MessageDeserializer extends System {
  constructor(engine: Engine) {
    super(engine);
  }

  start(): void {}

  update(): void {
    this.engine.removeComponentsOfClasses(...MESSAGE_COMPONENT_CLASSES);
    this.engine.query(this.createMessageComponents, MessageEvent);
  }

  destroy(): void {}

  private createMessageComponents = ([{ fromEntityId, binaryMessage }]: [MessageEvent]) => {
    const entityId = this.engine.generateEntityId();
    const messageComponent = Reader.binaryToMessageComponent(entityId, binaryMessage, fromEntityId);
    this.engine.addComponent(messageComponent);
  };
}

export default MessageDeserializer;
