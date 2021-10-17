import Networked from "../../shared/components/interfaces/Networked";
import NetworkedComponentMessage from "../../shared/components/NetworkedComponentMessage";
import { Engine } from "../../shared/ecs";
import System from "../../shared/ecs/System";
import { ComponentClass, EntityId, QuerySet } from "../../shared/ecs/types";
import { MESSAGE_TYPE } from "../../shared/messages/schema";

class ApplyParsedMessages<T extends MESSAGE_TYPE> extends System {
  networkedComponentClass: ComponentClass<Networked<T>>;
  messageComponentClass: ComponentClass<NetworkedComponentMessage<T>>;

  constructor(
    engine: Engine,
    networkedComponentClass: ComponentClass<Networked<T>>,
    messageComponentClass: ComponentClass<NetworkedComponentMessage<T>>
  ) {
    super(engine);
    this.networkedComponentClass = networkedComponentClass;
    this.messageComponentClass = messageComponentClass;
  }

  start(): void {}

  update(): void {
    this.engine.query(this.applyMessageComponent, this.messageComponentClass);
  }

  destroy(): void {}

  private applyMessageComponent = (querySet: QuerySet) => {
    const [messageComponent] = querySet as [NetworkedComponentMessage<T>];
    const { parsedMessage } = messageComponent;

    const entityId = this.engine.getOrAddEntityIdByAlias(<number>parsedMessage.entityId);
    const networkedComponent = this.engine.getOrCreateNullComponentById(
      entityId,
      this.networkedComponentClass
    );

    networkedComponent.applyParsedMessage(parsedMessage);
  };
}

export default ApplyParsedMessages;
