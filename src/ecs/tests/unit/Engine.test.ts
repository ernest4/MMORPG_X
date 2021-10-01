import { context } from "../../../../tests/testAliases";
import Component from "../../Component";
import Engine from "../../Engine";
import System from "../../System";
import NumberComponent from "../helpers/components/NumberComponent";
import StringComponent from "../helpers/components/StringComponent";

class TestySystem extends System {
  // TODO: ...
  constructor(engine: Engine) {
    super(engine);
  }

  start(): void {
    // TODO: add some entities for testing...

    throw new Error("Method not implemented.");
  }
  update(): void {
    throw new Error("Method not implemented.");
  }
  destroy(): void {
    throw new Error("Method not implemented.");
  }
}

// class TestySystem2 extends System {
//
// }

// class TestySystem3 extends System {
//
// }

describe(Engine, () => {
  let engine: Engine;
  let testySystem1: System;
  let testySystem2: System;
  let testySystem3: System;

  let entityId = 0;
  let entityId2 = 1;
  let entityId3 = 2;

  let queryCallBackFunction: jest.Mock<any, any>;

  let component: Component;
  let component2: Component;

  beforeEach(() => {
    engine = new Engine();

    testySystem1 = new TestySystem(engine);
    testySystem1.start = jest.fn();
    testySystem1.update = jest.fn();

    testySystem2 = new TestySystem(engine);
    testySystem2.start = jest.fn();
    testySystem2.update = jest.fn();

    testySystem3 = new TestySystem(engine);
    testySystem3.start = jest.fn();
    testySystem3.update = jest.fn();

    queryCallBackFunction = jest.fn();
  });

  describe("#addSystem", () => {
    beforeEach(() => {
      engine.addSystem(testySystem1);
      engine.addSystem(testySystem2);
      engine.addSystem(testySystem3);
    });

    it("calls start() on the system", () => {
      expect(testySystem1.start).toBeCalledTimes(1);
      expect(testySystem2.start).toBeCalledTimes(1);
      expect(testySystem3.start).toBeCalledTimes(1);
    });
  });

  describe("#addComponent", () => {
    beforeEach(() => {
      entityId = engine.generateEntityId();
      component = new NumberComponent(entityId);
    });

    context("when component doesn't exist", () => {
      beforeEach(() => {
        engine.addComponent(component);
        engine.query(queryCallBackFunction, NumberComponent);
      });

      it("adds the component", () => {
        expect(queryCallBackFunction).toBeCalledTimes(1);
        expect(queryCallBackFunction).toBeCalledWith([component]);
      });
    });

    context("when component does exist", () => {
      beforeEach(() => {
        engine.addComponent(component);
        engine.addComponent(component);
        engine.query(queryCallBackFunction, NumberComponent);
      });

      it("adds the component once", () => {
        expect(queryCallBackFunction).toBeCalledTimes(1);
        expect(queryCallBackFunction).toBeCalledWith([component]);
      });
    });
  });

  describe("#removeComponent", () => {
    beforeEach(() => {
      entityId = engine.generateEntityId();
      component = new NumberComponent(entityId);
    });

    context("when component doesn't exist", () => {
      beforeEach(() => {
        engine.removeComponent(component);
        engine.query(queryCallBackFunction, NumberComponent);
      });

      it("does nothing", () => {
        expect(queryCallBackFunction).not.toBeCalled();
      });
    });

    context("when component exists", () => {
      beforeEach(() => {
        engine.addComponent(component);
        engine.removeComponent(component);
        engine.query(queryCallBackFunction, NumberComponent);
      });

      it("removes the component", () => {
        expect(queryCallBackFunction).not.toBeCalled();
      });

      context("when no other component has the same entity Id", () => {
        it("reclaims the id", () => {
          expect(engine.generateEntityId()).toEqual(component.id);
        });
      });

      context("when another component has the same entity Id", () => {
        beforeEach(() => {
          engine.generateEntityId();
          engine.generateEntityId();
          engine.generateEntityId();
          entityId = engine.generateEntityId();
          component = new NumberComponent(entityId);
          engine.addComponent(component);
          engine.addComponent(new StringComponent(component.id));
          engine.removeComponent(component);
        });

        it("does not reclaim the id", () => {
          expect(engine.generateEntityId()).not.toEqual(component.id);
        });
      });
    });
  });

  describe("#removeComponentById", () => {
    beforeEach(() => {
      entityId = engine.generateEntityId();
      component = new NumberComponent(entityId);
    });

    context("when component doesn't exist", () => {
      beforeEach(() => {
        engine.removeComponentById(NumberComponent, component.id);
        engine.query(queryCallBackFunction, NumberComponent);
      });

      it("does nothing", () => {
        expect(queryCallBackFunction).not.toBeCalled();
      });
    });

    context("when component exists", () => {
      beforeEach(() => {
        engine.addComponent(component);
        engine.removeComponentById(NumberComponent, component.id);
        engine.query(queryCallBackFunction, NumberComponent);
      });

      it("removes the component", () => {
        expect(queryCallBackFunction).not.toBeCalled();
      });

      context("when no other component has the same entity Id", () => {
        it("reclaims the id", () => {
          expect(engine.generateEntityId()).toEqual(component.id);
        });
      });

      context("when another component has the same entity Id", () => {
        beforeEach(() => {
          engine.generateEntityId();
          engine.generateEntityId();
          engine.generateEntityId();
          entityId = engine.generateEntityId();
          component = new NumberComponent(entityId);
          engine.addComponent(component);
          engine.addComponent(new StringComponent(component.id));
          engine.removeComponentById(NumberComponent, component.id);
        });

        it("does not reclaim the id", () => {
          expect(engine.generateEntityId()).not.toEqual(component.id);
        });
      });
    });
  });

  describe("#getComponent", () => {
    beforeEach(() => {
      entityId = engine.generateEntityId();
      component = new NumberComponent(entityId);
      engine.addComponent(component);
    });

    context("when entity has component", () => {
      it("returns component", () => {
        expect(engine.getComponent<NumberComponent>(NumberComponent, entityId)).toEqual(component);
      });
    });

    context("when entity does not have the component", () => {
      beforeEach(() => {
        engine.removeComponent(component);
      });

      it("returns null", () => {
        expect(engine.getComponent<NumberComponent>(NumberComponent, entityId)).toEqual(null);
      });
    });

    context("when no component of that type exists at all", () => {
      it("returns null", () => {
        expect(engine.getComponent<StringComponent>(StringComponent, entityId)).not.toBeDefined();
      });
    });
  });

  describe("#getComponents", () => {
    beforeEach(() => {
      entityId = engine.generateEntityId();
      component = new NumberComponent(entityId);
      engine.addComponent(component);
      component2 = new StringComponent(entityId);
      engine.addComponent(component2);
    });

    context("when entity has all possible components", () => {
      it("returns array of components for given entityId", () => {
        expect(engine.getComponents(entityId)).toEqual([component, component2]);
      });
    });

    context("when entity has only some of the possible components", () => {
      beforeEach(() => {
        engine.removeComponent(component);
      });

      it("returns array of components for given entityId", () => {
        expect(engine.getComponents(entityId)).toEqual([component2]);
      });
    });
  });

  describe("#generateEntityId", () => {
    it("returns entityId", () => {
      expect(engine.generateEntityId()).toBeNumber();
    });
  });

  describe("#removeEntity", () => {
    beforeEach(() => {
      entityId = engine.generateEntityId();

      engine.addComponent(new NumberComponent(entityId));
      engine.addComponent(new StringComponent(entityId));

      engine.removeEntity(entityId);
    });

    it("removes all components associated with the entityId", () => {
      engine.query(queryCallBackFunction, NumberComponent);
      expect(queryCallBackFunction).not.toBeCalled();

      engine.query(queryCallBackFunction, StringComponent);
      expect(queryCallBackFunction).not.toBeCalled();
    });

    it("makes returns the entityId again when generating new entityId", () => {
      expect(engine.generateEntityId()).toEqual(entityId);
    });
  });

  describe("#removeAllEntities", () => {
    beforeEach(() => {
      entityId = engine.generateEntityId();
      entityId2 = engine.generateEntityId();

      engine.addComponent(new NumberComponent(entityId));
      engine.addComponent(new StringComponent(entityId));

      engine.addComponent(new NumberComponent(entityId2));
      engine.addComponent(new StringComponent(entityId2));

      engine.removeAllEntities();
    });

    it("removes all components associated with the entityId", () => {
      engine.query(queryCallBackFunction, NumberComponent);
      expect(queryCallBackFunction).not.toBeCalled();

      engine.query(queryCallBackFunction, StringComponent);
      expect(queryCallBackFunction).not.toBeCalled();
    });

    it("starts entityId count from zero", () => {
      expect(engine.generateEntityId()).toEqual(0);
    });
  });

  describe("#update", () => {
    let deltaTime = 123;

    beforeEach(() => {
      engine.addSystem(testySystem1);
      engine.addSystem(testySystem2);
      engine.addSystem(testySystem3);

      engine.update(deltaTime);
    });

    it("calls update() on all added systems", () => {
      expect(testySystem1.update).toBeCalledTimes(1);
      expect(testySystem2.update).toBeCalledTimes(1);
      expect(testySystem3.update).toBeCalledTimes(1);
    });

    it("calls update() on all added systems in sequence of addition", () => {
      expect(testySystem2.update).toHaveBeenCalledAfter(testySystem1.update as any);
      expect(testySystem3.update).toHaveBeenCalledAfter(testySystem2.update as any);
    });

    it("returns deltaTime of the engine", () => {
      expect(testySystem1.deltaTime).toEqual(deltaTime);
      expect(testySystem2.deltaTime).toEqual(deltaTime);
      expect(testySystem3.deltaTime).toEqual(deltaTime);
    });
  });

  // TODO: ... more cases ??
  describe("#query", () => {
    beforeEach(() => {
      entityId = engine.generateEntityId();
      entityId2 = engine.generateEntityId();
      entityId3 = engine.generateEntityId();
    });

    context("when there are no components", () => {
      beforeEach(() => {
        engine.query(queryCallBackFunction, NumberComponent);
      });

      it("doesn't call back", () => {
        expect(queryCallBackFunction).not.toBeCalled();
      });
    });

    context("when no components exist in one of the lists", () => {
      beforeEach(() => {
        engine.addComponent(new NumberComponent(entityId));

        engine.query(queryCallBackFunction, NumberComponent, StringComponent);
      });

      it("doesn't call back", () => {
        expect(queryCallBackFunction).not.toBeCalled();
      });
    });

    context("when more than one entity exists", () => {
      let numberComponent = new NumberComponent(entityId);
      let numberComponent2 = new NumberComponent(entityId2);
      let numberComponent3 = new NumberComponent(entityId3);

      let stringComponent = new StringComponent(entityId);
      let stringComponent2 = new StringComponent(entityId2);

      beforeEach(() => {
        engine.addComponent(numberComponent);
        engine.addComponent(numberComponent2);
        engine.addComponent(numberComponent3);

        engine.addComponent(stringComponent);
        engine.addComponent(stringComponent2);

        engine.query(queryCallBackFunction, NumberComponent, StringComponent);
      });

      it("only returns entities that have all the components in the query", () => {
        expect(queryCallBackFunction).toBeCalledTimes(2);
        // NOTE: the array order in the toBeCalledWith is enforced by Jest (thats good!)
        expect(queryCallBackFunction).toBeCalledWith([numberComponent, stringComponent]);
        expect(queryCallBackFunction).toBeCalledWith([numberComponent2, stringComponent2]);
      });
    });

    context("when component lists are different lengths", () => {
      beforeEach(() => {
        engine.addComponent(new NumberComponent(entityId));
        engine.addComponent(new NumberComponent(entityId2));
        engine.addComponent(new NumberComponent(entityId3));

        engine.addComponent(new StringComponent(entityId));
        engine.addComponent(new StringComponent(entityId2));

        engine.query(queryCallBackFunction, NumberComponent, StringComponent);
      });

      it("iterates as far as the shortest list only", () => {
        expect(queryCallBackFunction).toBeCalledTimes(2);
      });
    });
  });

  describe("#deltaTime", () => {
    let deltaTime = 123;

    beforeEach(() => {
      engine.update(deltaTime);
    });

    it("calls returns deltaTime", () => {
      expect(engine.deltaTime).toEqual(deltaTime);
    });
  });
});
