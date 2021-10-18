import Component from "../../ecs/Component";
import { EntityId } from "../../ecs/types";

interface Event extends Component {
  // readonly messageType: T;

  // get parsedMessage(): ParsedMessage<T>;
  // synchronizeFrom(parsedMessage: ParsedMessage<T>): void;

  get targetEntityId(): EntityId;
}

export default Event;
