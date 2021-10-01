import { Engine } from "../../ecs";
import System from "../../ecs/System";
import { QuerySet } from "../../ecs/types";
import PhysicsBody from "../components/PhysicsBody";
import Transform from "../components/Transform";

class Movement extends System {
  constructor(engine: Engine) {
    super(engine);
  }

  start(): void {}

  update(): void {
    // apply PhysicsBody to transform
    this.engine.query(this.updateTransforms, Transform, PhysicsBody);
  }

  destroy(): void {}

  private updateTransforms = (querySet: QuerySet) => {
    const [transform, physicsBody] = querySet as [Transform, PhysicsBody];

    const seconds = this.deltaTime / 1000;

    transform.position.x += physicsBody.linearVelocity.x * seconds;
    transform.position.y += physicsBody.linearVelocity.y * seconds;

    transform.rotation.z += physicsBody.angularVelocity.z * seconds;
    if (360 < transform.rotation.z) transform.rotation.z = transform.rotation.z - 360;
  };
}

export default Movement;
