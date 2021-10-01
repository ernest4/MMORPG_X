import { context } from "../../../../tests/testAliases";
import { Engine } from "../../../ecs";
import PhysicsBody from "../../components/PhysicsBody";
import Transform from "../../components/Transform";
import Movement from "../Movement";

describe(Movement, () => {
  let engine: Engine;
  let described_class: Movement;

  let entityId = 0;

  let deltaTime = 1000;

  beforeEach(() => {
    engine = new Engine();
    described_class = new Movement(engine);
    engine.addSystem(described_class);
  });

  describe("#addSystem", () => {
    beforeEach(() => {
      let entityId = engine.generateEntityId();
      let transform = new Transform(entityId);
      transform.position.x = 5;
      transform.position.y = 6;
      transform.scale.x = 1;
      transform.scale.y = 1;
      engine.addComponent(transform);

      let physicsBody = new PhysicsBody(entityId);
      physicsBody.linearVelocity.x = 100;
      physicsBody.linearVelocity.y = 100;
      physicsBody.angularVelocity.z = 100;
      engine.addComponent(physicsBody);

      engine.update(deltaTime);
    });

    it("updates transforms based on physicsBody", () => {
      const transform = engine.getComponent<Transform>(Transform, entityId);
      expect(transform!.position.x).toEqual(105);
      expect(transform!.position.y).toEqual(106);
      expect(transform!.rotation.z).toEqual(100);

      deltaTime = 2000;
      engine.update(deltaTime);

      expect(transform!.position.x).toEqual(305);
      expect(transform!.position.y).toEqual(306);
      expect(transform!.rotation.z).toEqual(300);
    });
  });
});
