import { DIRECTION, DIRECTIONS } from "../../server/systems/MovementControl";
import OutgoingMessage from "../../shared/components/OutgoingMessage";
import { Engine } from "../../shared/ecs";
import System from "../../shared/ecs/System";
import { QuerySet } from "../../shared/ecs/types";
import { MESSAGE_TYPE } from "../../shared/messages/schema";
import InputEvent from "../components/InputEvent";
import { INPUT_EVENT_TYPES, INPUT_KEYS } from "./InputListener";

const MOVEMENT_INPUTS = [
  [INPUT_EVENT_TYPES.KEYDOWN, INPUT_KEYS.A],
  [INPUT_EVENT_TYPES.KEYDOWN, INPUT_KEYS.W],
  [INPUT_EVENT_TYPES.KEYDOWN, INPUT_KEYS.S],
  [INPUT_EVENT_TYPES.KEYDOWN, INPUT_KEYS.D],

  // [INPUT_EVENT_TYPES.KEYUP, INPUT_KEYS.A],
  // [INPUT_EVENT_TYPES.KEYUP, INPUT_KEYS.W],
  // [INPUT_EVENT_TYPES.KEYUP, INPUT_KEYS.S],
  // [INPUT_EVENT_TYPES.KEYUP, INPUT_KEYS.D],
];

class MovementControl extends System {
  constructor(engine: Engine) {
    super(engine);
  }

  start(): void {}

  update(): void {
    this.engine.query(this.applyInputEvents, InputEvent);
  }

  destroy(): void {}

  private applyInputEvents = (querySet: QuerySet) => {
    const [inputEvent] = querySet as [InputEvent];

    if (this.isMovementInput(inputEvent)) this.applyMovementInputEvent(inputEvent);
  };

  private isMovementInput = ({ type, key }: InputEvent): boolean => {
    return MOVEMENT_INPUTS.some(
      ([movementType, movementKey]) => type === movementType && key === movementKey
    );
  };

  private applyMovementInputEvent = (inputEvent: InputEvent) => {
    const direction = this.getDirection(inputEvent);
    if (!direction) return;

    this.engine.addComponent(
      new OutgoingMessage(this.newEntityId(), MESSAGE_TYPE.MOVE, { direction })
    );
  };

  private getDirection = ({ type, key }: InputEvent): DIRECTION | null => {
    switch (key) {
      case INPUT_KEYS.A:
        if (type === INPUT_EVENT_TYPES.KEYDOWN) return DIRECTIONS.LEFT;
        break;
      case INPUT_KEYS.D:
        if (type === INPUT_EVENT_TYPES.KEYDOWN) return DIRECTIONS.RIGHT;
        break;
      case INPUT_KEYS.W:
        if (type === INPUT_EVENT_TYPES.KEYDOWN) return DIRECTIONS.UP;
        break;
      case INPUT_KEYS.S:
        if (type === INPUT_EVENT_TYPES.KEYDOWN) return DIRECTIONS.DOWN;
        break;
    }

    return null;
  };
}

export default MovementControl;
