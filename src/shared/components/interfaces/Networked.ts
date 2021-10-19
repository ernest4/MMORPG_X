import Component from "../../ecs/Component";
import { MESSAGE_TYPE, ParsedMessage } from "../../messages/schema";

interface Networked<T extends MESSAGE_TYPE> extends Component {
  parsedMessage(): ParsedMessage<T>;
  synchronizeFrom(parsedMessage: ParsedMessage<T>): void;
}

export default Networked;
