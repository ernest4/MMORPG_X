import { EntityId } from "../ecs/types";
import { Int32, MESSAGE_TYPE, ParsedMessage } from "../messages/schema";
import Message from "./Message";

class NetworkedComponentMessage<T extends MESSAGE_TYPE> extends Message<T> {
  parsedMessage: { entityId: Int32 } & ParsedMessage<T>;

  constructor(
    entityId: EntityId,
    parsedMessage: { entityId: Int32 } & ParsedMessage<T>,
    sender?: EntityId
  ) {
    super(entityId, parsedMessage, sender);
  }
}

export default NetworkedComponentMessage;
