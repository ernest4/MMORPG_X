import Move from "../../shared/components/message/Move";
import { Engine } from "../../shared/ecs";
import System from "../../shared/ecs/System";
import { QuerySet } from "../../shared/ecs/types";
import { VectorHash } from "../../shared/ecs/utils/Vector3BufferView";
import Character from "../components/Character";
import PhysicsBody from "../components/PhysicsBody";
import Speed from "../components/Speed";

const LEFT = 1;
const LEFT_TOP = 2;
const TOP = 3;
const RIGHT_TOP = 4;
const RIGHT = 5;
const RIGHT_BOTTOM = 6;
const BOTTOM = 7;
const LEFT_BOTTOM = 8;

class MovementControl extends System {
  constructor(engine: Engine) {
    super(engine);
  }

  start(): void {}

  update(): void {
    this.engine.query(this.stopMovement, Character, PhysicsBody);
    this.engine.query(this.applyMoveMessage, Move);
  }

  destroy(): void {}

  private stopMovement = ([_, physicsBody]: [Character, PhysicsBody]) => {
    physicsBody.linearVelocity.xyz = { x: 0, y: 0 };
  };

  private applyMoveMessage = ([{ fromEntityId, parsedMessage }]: [Move]) => {
    // TODO: future 'Entity' API sample: ...
    // const entity = this.engine.getEntity(move.fromEntityId);
    // const [physicsBody, speed] = entity.getComponents(PhysicsBody, Speed) as [PhysicsBody, Speed];
    // OR? const [physicsBody, speed] = entity.getComponents<PhysicsBody, Speed>(PhysicsBody, Speed);
    const physicsBody = this.engine.getComponent<PhysicsBody>(PhysicsBody, fromEntityId);
    const { speed } = this.engine.getComponent<Speed>(Speed, fromEntityId);
    const direction = parsedMessage.direction;
    const newLinearVelocity = this.calculateNewLinearVelocity(speed, direction);
    physicsBody.linearVelocity.xyz = newLinearVelocity;
  };

  private calculateNewLinearVelocity = (speed: number, direction: number): VectorHash => {
    let newLinearVelocity: VectorHash = { x: 0, y: 0 };

    switch (direction) {
      case LEFT:
        newLinearVelocity = { x: -speed, y: 0 };
        break;
      case LEFT_TOP:
        newLinearVelocity = { x: -speed, y: -speed };
        break;
      case TOP:
        newLinearVelocity = { x: 0, y: -speed };
        break;
      case RIGHT_TOP:
        newLinearVelocity = { x: speed, y: -speed };
        break;
      case RIGHT:
        newLinearVelocity = { x: speed, y: 0 };
        break;
      case RIGHT_BOTTOM:
        newLinearVelocity = { x: speed, y: speed };
        break;
      case BOTTOM:
        newLinearVelocity = { x: 0, y: speed };
        break;
      case LEFT_BOTTOM:
        newLinearVelocity = { x: -speed, y: speed };
        break;
    }

    return newLinearVelocity;
  };
}

export default MovementControl;
