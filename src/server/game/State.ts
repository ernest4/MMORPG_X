import Room from "./state/Room";

export const DEFAULT_ROOM_NAME = "hub_0";

// TODO: jests
class State {
  rooms: { [roomName: string]: Room };

  constructor() {
    this.rooms = {};
  }

  load = () => {
    // TODO: ... load from files ?!? CSV, to stream world info cell by cell?
    this.rooms[DEFAULT_ROOM_NAME] = new Room();
  };
}

export default State;
