import Component from "../../shared/ecs/Component";
import { EntityId } from "../../shared/ecs/types";

// TODO: optimize with ArrayBuffers ??
class Room extends Component {
  roomName: string;

  constructor(entityId: EntityId, roomName: string) {
    super(entityId);
    this.roomName = roomName;
  }
}

export default Room;
