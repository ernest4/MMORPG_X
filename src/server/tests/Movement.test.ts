import { context } from "../../../tests/jestHelpers";
import Transform from "../../shared/components/Transform";
import { Engine } from "../../shared/ecs";
import PhysicsBody from "../components/PhysicsBody";
import Movement from "../systems/Movement";

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
      let entityId = engine.newEntityId();
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
      const transform = engine.getComponentById(entityId, Transform);
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
