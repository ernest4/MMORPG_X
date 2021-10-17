import System from "../ecs/System";
import { EntityId } from "../ecs/types";
import OutMessage from "../components/OutMessage";
import { MESSAGE_TYPE, ParsedMessage } from "../messages/schema";
import NetworkedComponent from "../components/interfaces/Networked";

abstract class Networked extends System {
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

  addOutMessageComponent = <T extends MESSAGE_TYPE>(
    networkedComponent: NetworkedComponent<T>,
    recipient?: EntityId
  ) => {
    this.engine.addComponent(this.newOutMessageComponent(networkedComponent, recipient));
  };

  addOutMessageComponents = (components: NetworkedComponent<any>[], recipient?: EntityId) => {
    this.engine.addComponents(
      ...components.map(component => this.newOutMessageComponent(component, recipient))
    );
  };

  newOutMessageComponent = <T extends MESSAGE_TYPE>(
    { messageType, parsedMessage, entityId }: NetworkedComponent<T>,
    recipient?: EntityId
  ) => {
    return new OutMessage(this.newEntityId(), messageType, parsedMessage, recipient || entityId);
  };

  newOutMessageComponents = (components: NetworkedComponent<any>[], recipient?: EntityId) => {
    return components.map(component => this.newOutMessageComponent(component, recipient));
  };

  // TODO: maybe these helpers too??
  // private createRoomInitMessageComponent = ({ roomName }: Room, toEntityId: EntityId) => {
  //   return new OutMessage(
  //     this.newEntityId(),
  //     MESSAGE_TYPE.ROOM_INIT,
  //     this._state.rooms[roomName],
  //     toEntityId
  //   );
  // };

  // private getCharacterComponents = (entityId: EntityId) => {
  //   return [
  //     this.engine.getComponent<Character>(Character, entityId),
  //     this.engine.getComponent<Name>(Name, entityId),
  //     this.engine.getComponent<Type>(Type, entityId),
  //     this.engine.getComponent<HitPoints>(HitPoints, entityId),
  //     this.engine.getComponent<Transform>(Transform, entityId),
  //   ];
  // };
}

export default Networked;
