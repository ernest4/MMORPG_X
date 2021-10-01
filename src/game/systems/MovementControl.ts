import { Engine } from "../../ecs";
import System from "../../ecs/System";
import { InputEventType, QuerySet } from "../../ecs/types";
import InputEvent from "../components/InputEvent";
import PhysicsBody from "../components/PhysicsBody";
import Player from "../components/Player";

const MOVEMENT_INPUTS = [
  { type: InputEventType.KEYDOWN, key: "A" },
  { type: InputEventType.KEYDOWN, key: "W" },
  { type: InputEventType.KEYDOWN, key: "S" },
  { type: InputEventType.KEYDOWN, key: "D" },

  { type: InputEventType.KEYUP, key: "A" },
  { type: InputEventType.KEYUP, key: "W" },
  { type: InputEventType.KEYUP, key: "S" },
  { type: InputEventType.KEYUP, key: "D" },
];

class MovementControl extends System {
  private _filteredInputEvents: InputEvent[];

  constructor(engine: Engine) {
    super(engine);
    this._filteredInputEvents = [];
  }

  start(): void {
    // throw new Error("Method not implemented.");
  }

  update(): void {
    // flush the cache
    this._filteredInputEvents = [];

    // get movement related input events
    this.engine.query(this.filterInputEvents, InputEvent);

    // apply inputEvent to PhysicsBody
    this.engine.query(this.applyInputEvents, Player, PhysicsBody);
  }

  destroy(): void {
    // throw new Error("Method not implemented.");
  }

  private filterInputEvents = (querySet: QuerySet) => {
    const [inputEvent] = querySet as [InputEvent];

    if (this.isMovementInput(inputEvent)) this._filteredInputEvents.push(inputEvent);
  };

  private isMovementInput = ({ type, key }: InputEvent): boolean =>
    MOVEMENT_INPUTS.some(
      ({ type: existingType, key: existingKey }) => type === existingType && key === existingKey
    );

  private applyInputEvents = (querySet: QuerySet) => {
    const [player, physicsBody] = querySet as [Player, PhysicsBody];

    this._filteredInputEvents.forEach(inputEvent => this.applyInputEvent(inputEvent, physicsBody));
  };

  private applyInputEvent = ({ type, key }: InputEvent, physicsBody: PhysicsBody) => {
    switch (key) {
      // TODO: magic values for now, but will probably come from some 'Stats' component that
      // defines the min/max speed of the Entity etc. (which in turn will be affected by
      // what mode of transport is in use e.g. 'on foot' or 'car' or 'helicopter' etc.)
      case "A":
        // this.applyKeyToVelocity(physicsBody, "x", type, -80);
        if (type === InputEventType.KEYUP && physicsBody.linearVelocity.x < 0) {
          physicsBody.linearVelocity.x = 0;
          break;
        }

        if (type === InputEventType.KEYDOWN) physicsBody.linearVelocity.x = -80;
        break;
      case "D":
        if (type === InputEventType.KEYUP && 0 < physicsBody.linearVelocity.x) {
          physicsBody.linearVelocity.x = 0;
          break;
        }

        if (type === InputEventType.KEYDOWN) physicsBody.linearVelocity.x = 80;
        break;
      case "W":
        if (type === InputEventType.KEYUP && physicsBody.linearVelocity.y < 0) {
          physicsBody.linearVelocity.y = 0;
          break;
        }

        if (type === InputEventType.KEYDOWN) physicsBody.linearVelocity.y = -80;
        break;
      case "S":
        if (type === InputEventType.KEYUP && 0 < physicsBody.linearVelocity.y) {
          physicsBody.linearVelocity.y = 0;
          break;
        }

        if (type === InputEventType.KEYDOWN) physicsBody.linearVelocity.y = 80;
        break;
      default:
        console.warn(
          "[MovementControl]: Input event not recognized, though it passed the filtering stage!"
        );
        console.warn({ key, type });
    }
  };

  // private applyKeyToVelocity = (
  //   physicsBody: PhysicsBody,
  //   axis: "x" | "y",
  //   type: InputEventType,
  //   value: number
  // ) => {
  //   if (type === InputEventType.KEYUP && physicsBody.linearVelocity.x < 0) {
  //     physicsBody.linearVelocity[axis] = 0;
  //     return;
  //   }

  //   if (type === InputEventType.KEYDOWN) physicsBody.linearVelocity.x = -80;
  // };
}

export default MovementControl;
