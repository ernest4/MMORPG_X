import Move from "../../shared/components/message/Move";
import { Engine } from "../../shared/ecs";
import System from "../../shared/ecs/System";
import { VectorHash } from "../../shared/ecs/utils/Vector3BufferView";
import Character from "../../shared/components/Character";
import PhysicsBody from "../components/PhysicsBody";
import Speed from "../components/Speed";

export const DIRECTIONS = {
  LEFT: 1,
  LEFT_UP: 2,
  UP: 3,
  RIGHT_UP: 4,
  RIGHT: 5,
  RIGHT_DOWN: 6,
  DOWN: 7,
  LEFT_DOWN: 8,
} as const;

export type DIRECTION = typeof DIRECTIONS[keyof typeof DIRECTIONS];

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
      case DIRECTIONS.LEFT:
        newLinearVelocity = { x: -speed, y: 0 };
        break;
      case DIRECTIONS.LEFT_UP:
        newLinearVelocity = { x: -speed, y: -speed };
        break;
      case DIRECTIONS.UP:
        newLinearVelocity = { x: 0, y: -speed };
        break;
      case DIRECTIONS.RIGHT_UP:
        newLinearVelocity = { x: speed, y: -speed };
        break;
      case DIRECTIONS.RIGHT:
        newLinearVelocity = { x: speed, y: 0 };
        break;
      case DIRECTIONS.RIGHT_DOWN:
        newLinearVelocity = { x: speed, y: speed };
        break;
      case DIRECTIONS.DOWN:
        newLinearVelocity = { x: 0, y: speed };
        break;
      case DIRECTIONS.LEFT_DOWN:
        newLinearVelocity = { x: -speed, y: speed };
        break;
    }

    return newLinearVelocity;
  };
}

export default MovementControl;
