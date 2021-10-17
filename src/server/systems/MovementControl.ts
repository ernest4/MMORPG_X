import { Engine } from "../../shared/ecs";
import System from "../../shared/ecs/System";
import { Vector3Hash } from "../../shared/ecs/utils/Vector3BufferView";
import Character from "../../shared/components/Character";
import PhysicsBody from "../components/PhysicsBody";
import Speed from "../components/Speed";
import { QuerySet } from "../../shared/ecs/types";
import { MoveMessage } from "../../shared/messages/schema";

export enum DIRECTION {
  LEFT,
  LEFT_UP,
  UP,
  RIGHT_UP,
  RIGHT,
  RIGHT_DOWN,
  DOWN,
  LEFT_DOWN,
}

class MovementControl extends System {
  constructor(engine: Engine) {
    super(engine);
  }

  start(): void {}

  update(): void {
    this.engine.query(this.stopMovement, Character, PhysicsBody);
    this.engine.query(this.applyMoveMessage, MoveMessage);
  }

  destroy(): void {}

  private stopMovement = ([character, physicsBody]: [Character, PhysicsBody]) => {
    physicsBody.linearVelocity.xyz = { x: 0, y: 0, z: 0 };
  };

  private applyMoveMessage = (querySet: QuerySet) => {
    const [
      {
        sender: fromEntityId,
        parsedMessage: { direction },
      },
    ] = querySet as [MoveMessage];
    // TODO: future 'Entity' API sample: ...
    // const entity = this.engine.getEntity(move.fromEntityId);
    // const [physicsBody, speed] = entity.getComponents(PhysicsBody, Speed) as [PhysicsBody, Speed];
    // OR? const [physicsBody, speed] = entity.getComponents<PhysicsBody, Speed>(PhysicsBody, Speed);

    const [physicsBody, { speed }] = <[PhysicsBody, Speed]>(
      this.engine.getComponentsById(fromEntityId, PhysicsBody, Speed)
    );

    const newLinearVelocity = this.calculateNewLinearVelocity(speed, direction);
    physicsBody.linearVelocity.xyz = newLinearVelocity;
  };

  private calculateNewLinearVelocity = (speed: number, direction: number): Vector3Hash => {
    let newLinearVelocity: Vector3Hash = { x: 0, y: 0, z: 0 };

    switch (direction) {
      case DIRECTION.LEFT:
        newLinearVelocity = { x: -speed, y: 0, z: 0 };
        break;
      case DIRECTION.LEFT_UP:
        newLinearVelocity = { x: -speed, y: -speed, z: 0 };
        break;
      case DIRECTION.UP:
        newLinearVelocity = { x: 0, y: -speed, z: 0 };
        break;
      case DIRECTION.RIGHT_UP:
        newLinearVelocity = { x: speed, y: -speed, z: 0 };
        break;
      case DIRECTION.RIGHT:
        newLinearVelocity = { x: speed, y: 0, z: 0 };
        break;
      case DIRECTION.RIGHT_DOWN:
        newLinearVelocity = { x: speed, y: speed, z: 0 };
        break;
      case DIRECTION.DOWN:
        newLinearVelocity = { x: 0, y: speed, z: 0 };
        break;
      case DIRECTION.LEFT_DOWN:
        newLinearVelocity = { x: -speed, y: speed, z: 0 };
        break;
    }

    return newLinearVelocity;
  };
}

export default MovementControl;
