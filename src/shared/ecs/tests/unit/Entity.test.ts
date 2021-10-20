import { context } from "../../../../../tests/jestHelpers";
import Component from "../../Component";
import Engine from "../../Engine";
import Entity from "../../Entity";
import NumberComponent from "../helpers/components/NumberComponent";
import StringComponent from "../helpers/components/StringComponent";

describe(Entity, () => {
  let engine: Engine;

  let entityId = 0;
  let entityId2 = 1;

  let queryCallBackFunction: jest.Mock<any, any>;

  let component: Component;
  let component2: Component;
  let component3: Component;

  let entity: Entity;

  beforeEach(() => {
    engine = new Engine();
    queryCallBackFunction = jest.fn();
  });

  it("", () => {});

  // describe("Entity initialization", () => {
  //   beforeEach(() => {
  //     entityId = engine.newEntityId();
  //     component = new NumberComponent(entityId, 89);
  //     component2 = new StringComponent(entityId, "wowser");
  //     engine.addComponents(component, component2);
  //   });

  //   it("adds the components to the entity", () => {
  //     // NOTE: this is totally fine in JS, but TS gets real pissy about undefined methods like that
  //     // expect(entity.numbercomponent.testNumber).toEqual(89);
  //     // expect(entity.stringcomponent.testString).toEqual("wowser");

  //     expect((<NumberComponent>entity.components.numbercomponent).testNumber).toEqual(89);
  //     expect(entity.components.stringcomponent.testString).toEqual("wowser");
  //   });

  //   // context("when component doesn't exist", () => {
  //   //   beforeEach(() => {
  //   //     engine.addComponent(component);
  //   //     engine.query(queryCallBackFunction, NumberComponent);
  //   //   });

  //   //   it("adds the component", () => {
  //   //     expect(queryCallBackFunction).toBeCalledTimes(1);
  //   //     expect(queryCallBackFunction).toBeCalledWith([component]);
  //   //   });
  //   // });

  //   // context("when component does exist", () => {
  //   //   beforeEach(() => {
  //   //     engine.addComponent(component);
  //   //     engine.addComponent(component);
  //   //     engine.query(queryCallBackFunction, NumberComponent);
  //   //   });

  //   //   it("adds the component once", () => {
  //   //     expect(queryCallBackFunction).toBeCalledTimes(1);
  //   //     expect(queryCallBackFunction).toBeCalledWith([component]);
  //   //   });
  //   // });
  // });

  // describe("#addComponent", () => {
  //   beforeEach(() => {
  //     entityId = engine.newEntityId();
  //     component = new NumberComponent(entityId);
  //   });

  //   context("when component doesn't exist", () => {
  //     beforeEach(() => {
  //       engine.addComponent(component);
  //       engine.query(queryCallBackFunction, NumberComponent);
  //     });

  //     it("adds the component", () => {
  //       expect(queryCallBackFunction).toBeCalledTimes(1);
  //       expect(queryCallBackFunction).toBeCalledWith([component]);
  //     });
  //   });

  //   context("when component does exist", () => {
  //     beforeEach(() => {
  //       engine.addComponent(component);
  //       engine.addComponent(component);
  //       engine.query(queryCallBackFunction, NumberComponent);
  //     });

  //     it("adds the component once", () => {
  //       expect(queryCallBackFunction).toBeCalledTimes(1);
  //       expect(queryCallBackFunction).toBeCalledWith([component]);
  //     });
  //   });
  // });

  // describe("#addComponents", () => {
  //   beforeEach(() => {
  //     component = new NumberComponent(entityId);
  //     component2 = new NumberComponent(entityId2);
  //     component3 = new StringComponent(entityId3);
  //   });

  //   context("when components dont exist", () => {
  //     beforeEach(() => {
  //       engine.addComponents(component, component2, component3);
  //       engine.query(queryCallBackFunction, NumberComponent);
  //       engine.query(queryCallBackFunction2, StringComponent);
  //     });

  //     it("adds the component", () => {
  //       expect(queryCallBackFunction).toBeCalledTimes(2);
  //       // NOTE: format: array of array of args (where in case of query arg is also an array!)
  //       // expect(mockFn.mock.calls).toEqual([
  //       //   [arg1, arg2, ...], // First call
  //       //   [arg1, arg2, ...]  // Second call
  //       // ]);
  //       expect(queryCallBackFunction.mock.calls).toEqual([[[component]], [[component2]]]);
  //       expect(queryCallBackFunction2).toBeCalledTimes(1);
  //       expect(queryCallBackFunction2).toBeCalledWith([component3]);
  //     });
  //   });

  //   context("when component does exist", () => {
  //     beforeEach(() => {
  //       engine.addComponents(component, component);
  //       engine.query(queryCallBackFunction, NumberComponent);
  //     });

  //     it("adds the component once", () => {
  //       expect(queryCallBackFunction).toBeCalledTimes(1);
  //       expect(queryCallBackFunction).toBeCalledWith([component]);
  //     });
  //   });
  // });

  // describe("#removeComponent", () => {
  //   beforeEach(() => {
  //     entityId = engine.newEntityId();
  //     component = new NumberComponent(entityId);
  //   });

  //   context("when component doesn't exist", () => {
  //     beforeEach(() => {
  //       engine.removeComponent(component);
  //       engine.query(queryCallBackFunction, NumberComponent);
  //     });

  //     it("does nothing", () => {
  //       expect(queryCallBackFunction).not.toBeCalled();
  //     });
  //   });

  //   context("when component exists", () => {
  //     beforeEach(() => {
  //       engine.addComponent(component);
  //       engine.removeComponent(component);
  //       engine.query(queryCallBackFunction, NumberComponent);
  //     });

  //     it("removes the component", () => {
  //       expect(queryCallBackFunction).not.toBeCalled();
  //     });

  //     context("when no other component has the same entity Id", () => {
  //       it("reclaims the id", () => {
  //         expect(engine.newEntityId()).toEqual(component.id);
  //       });
  //     });

  //     context("when another component has the same entity Id", () => {
  //       beforeEach(() => {
  //         engine.newEntityId();
  //         engine.newEntityId();
  //         engine.newEntityId();
  //         entityId = engine.newEntityId();
  //         component = new NumberComponent(entityId);
  //         engine.addComponent(component);
  //         engine.addComponent(new StringComponent(component.id));
  //         engine.removeComponent(component);
  //       });

  //       it("does not reclaim the id", () => {
  //         expect(engine.newEntityId()).not.toEqual(component.id);
  //       });
  //     });
  //   });
  // });

  // describe("#removeComponents", () => {
  //   beforeEach(() => {
  //     component = new NumberComponent(entityId);
  //     component2 = new NumberComponent(entityId2);
  //     component3 = new StringComponent(entityId3);
  //   });

  //   context("when components dont exist", () => {
  //     beforeEach(() => {
  //       engine.removeComponents(component, component2, component3);

  //       engine.query(queryCallBackFunction, NumberComponent);
  //       engine.query(queryCallBackFunction2, StringComponent);
  //     });

  //     it("does nothing", () => {
  //       expect(queryCallBackFunction).not.toBeCalled();
  //       expect(queryCallBackFunction2).not.toBeCalled();
  //     });
  //   });

  //   context("when components exist", () => {
  //     beforeEach(() => {
  //       engine.addComponent(component);
  //       engine.addComponent(component2);
  //       engine.addComponent(component3);

  //       engine.removeComponentsOfClasses(NumberComponent, StringComponent);

  //       engine.query(queryCallBackFunction, NumberComponent);
  //       engine.query(queryCallBackFunction2, StringComponent);
  //     });

  //     it("removes the components", () => {
  //       expect(queryCallBackFunction).not.toBeCalled();
  //       expect(queryCallBackFunction2).not.toBeCalled();
  //     });
  //   });
  // });

  // describe("#getComponent", () => {
  //   beforeEach(() => {
  //     entityId = engine.newEntityId();
  //     component = new NumberComponent(entityId, 89);
  //     engine.addComponents(component);
  //     entity = new Entity(entityId, engine);
  //   });

  //   context("when entity has component", () => {
  //     it("returns component", () => {
  //       expect(entity.getComponent<NumberComponent>(NumberComponent)).toEqual(component);
  //     });
  //   });

  //   context("when entity does not have the component", () => {
  //     beforeEach(() => engine.removeComponent(component));

  //     it("returns null", () => {
  //       expect(entity.getComponent<NumberComponent>(NumberComponent)).toEqual(null);
  //     });
  //   });

  //   context("when no component of that type exists at all", () => {
  //     it("returns null", () => {
  //       expect(entity.getComponent<StringComponent>(StringComponent)).not.toBeDefined();
  //     });
  //   });
  // });

  // describe("#components", () => {
  //   beforeEach(() => {
  //     entityId = engine.newEntityId();
  //     component = new NumberComponent(entityId);
  //     component2 = new StringComponent(entityId);
  //     engine.addComponents(component, component2);
  //     entity = new Entity(entityId, engine);
  //   });

  //   context("when entity has all possible components", () => {
  //     it("returns hash of components for given entityId", () => {
  //       expect(entity.components).toEqual({
  //         numbercomponent: component,
  //         stringcomponent: component2,
  //       });
  //     });
  //   });

  //   context("when engine removes component", () => {
  //     context("when entity is reloaded", () => {
  //       beforeEach(() => {
  //         engine.removeComponent(component);
  //         entity.reload();
  //       });

  //       it("returns new hash of components for given entityId", () => {
  //         expect(entity.components).toEqual({ stringcomponent: component2 });
  //       });
  //     });

  //     context("when entity is reloaded", () => {
  //       beforeEach(() => {
  //         engine.removeComponent(component);
  //       });

  //       it("returns old hash of components for given entityId", () => {
  //         expect(entity.components).toEqual({
  //           numbercomponent: component,
  //           stringcomponent: component2,
  //         });
  //       });
  //     });
  //   });
  // });

  // describe("#getComponents", () => {
  //   beforeEach(() => {
  //     entityId = engine.newEntityId();
  //     component = new NumberComponent(entityId);
  //     component2 = new StringComponent(entityId);
  //     engine.addComponents(component, component2);
  //     entity = new Entity(entityId, engine);
  //   });

  //   context("when entity has all possible components", () => {
  //     it("returns array of components for given entityId", () => {
  //       expect(entity.getComponents()).toEqual([component, component2]);
  //     });
  //   });

  //   context("when entity has only some of the possible components", () => {
  //     beforeEach(() => engine.removeComponent(component));

  //     it("returns array of components for given entityId", () => {
  //       expect(entity.getComponents()).toEqual([component2]);
  //     });
  //   });
  // });
});
