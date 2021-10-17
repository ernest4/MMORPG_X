import System from "../ecs/System";
import { EntityId } from "../ecs/types";
import OutMessage from "../components/OutMessage";
import { MESSAGE_TYPE, ParsedMessage } from "../messages/schema";
import NetworkedComponent from "../components/interfaces/Networked";

// TODO: jests
abstract class Networked extends System {
  // TODO: jests
  addOutMessageComponentWith = <T extends MESSAGE_TYPE>(
    messageType: T,
    parsedMessage: ParsedMessage<T>,
    recipient?: EntityId
  ) => {
    this.engine.addComponent(
      new OutMessage(this.newEntityId(), messageType, parsedMessage, recipient)
    );
  };

  // addOutMessageComponentsWith = () => {
  //   // TODO: ...
  // };

  // TODO: jests
  addOutMessageComponent = <T extends MESSAGE_TYPE>(
    networkedComponent: NetworkedComponent<T>,
    recipient?: EntityId
  ) => {
    this.engine.addComponent(this.newOutMessageComponent(networkedComponent, recipient));
  };

  // TODO: jests
  addOutMessageComponents = (components: NetworkedComponent<any>[], recipient?: EntityId) => {
    this.engine.addComponents(
      ...components.map(component => this.newOutMessageComponent(component, recipient))
    );
  };

  // TODO: jests
  newOutMessageComponent = <T extends MESSAGE_TYPE>(
    { messageType, parsedMessage, entityId }: NetworkedComponent<T>,
    recipient?: EntityId
  ) => {
    return new OutMessage(this.newEntityId(), messageType, parsedMessage, recipient || entityId);
  };

  // TODO: jests
  newOutMessageComponents = (components: NetworkedComponent<any>[], recipient?: EntityId) => {
    return components.map(component => this.newOutMessageComponent(component, recipient));
  };
}

export default Networked;
