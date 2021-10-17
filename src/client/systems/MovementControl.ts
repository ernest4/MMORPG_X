import { DIRECTION } from "../../server/systems/MovementControl";
import Networked from "../../shared/systems/Networked";
import { Engine } from "../../shared/ecs";
import { QuerySet } from "../../shared/ecs/types";
import { MESSAGE_TYPE } from "../../shared/messages/schema";
import InputEvent from "../components/InputEvent";
import { INPUT_EVENT_TYPES, INPUT_KEYS } from "./InputListener";

class MovementControl extends Networked {
  constructor(engine: Engine) {
    super(engine);
  }

  start(): void {}

  update(): void {
    // TODO:
    // ok for now, need to get state later to distinguish between
    // 'D' for moving and 'D' for writing a message...
    // this.engine.query(this.applyInputEvents, InputEvent, Walking);
    // 'Walking' is a state component. Others could be e.g. 'Talking' when writing message?
    this.engine.query(this.applyInputEvents, InputEvent);
  }

  destroy(): void {}

  private applyInputEvents = (querySet: QuerySet) => {
    const [inputEvent] = querySet as [InputEvent];
    const direction = this.getDirection(inputEvent);
    if (direction === null) return;

    this.addOutMessageComponentWith(MESSAGE_TYPE.MOVE, { direction } as { direction: number });
  };

  private getDirection = ({ type, key }: InputEvent): DIRECTION | null => {
    switch (key) {
      case INPUT_KEYS.A:
        if (type === INPUT_EVENT_TYPES.KEYDOWN) return DIRECTION.LEFT;
        break;
      case INPUT_KEYS.D:
        if (type === INPUT_EVENT_TYPES.KEYDOWN) return DIRECTION.RIGHT;
        break;
      case INPUT_KEYS.W:
        if (type === INPUT_EVENT_TYPES.KEYDOWN) return DIRECTION.UP;
        break;
      case INPUT_KEYS.S:
        if (type === INPUT_EVENT_TYPES.KEYDOWN) return DIRECTION.DOWN;
        break;
    }

    return null;
  };
}

export default MovementControl;
