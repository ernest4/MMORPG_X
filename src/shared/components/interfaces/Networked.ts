import Component from "../../ecs/Component";
// import { EntityId } from "../../ecs/types";
import { MESSAGE_TYPE, ParsedMessage } from "../../messages/schema";

// abstract class Networked<T extends MESSAGE_TYPE> extends Component {
//   readonly messageType: T;

//   constructor(entityId: EntityId) {
//     super(entityId);
//   }

//   abstract get parsedMessage(): ParsedMessage<T>;
// }

interface Networked<T extends MESSAGE_TYPE> extends Component {
  readonly messageType: T;

  get parsedMessage(): ParsedMessage<T>;
}

export default Networked;
