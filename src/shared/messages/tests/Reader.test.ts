import { context } from "../../../tests/jestHelpers";
import Reader from "../schema/Reader";
// import Component from "../../Component";
// import Engine from "../../Engine";
// import System from "../../System";
// import SparseSet from "../../utils/SparseSet";
// import NumberComponent from "../helpers/components/NumberComponent";
// import StrictNumberComponent from "../helpers/components/StrictNumberComponent";
// import StringComponent from "../helpers/components/StringComponent";

// class TestySystem extends System {
//   // TODO: ...
//   constructor(engine: Engine) {
//     super(engine);
//   }

//   start(): void {
//     // TODO: add some entities for testing...

//     throw new Error("Method not implemented.");
//   }
//   update(): void {
//     throw new Error("Method not implemented.");
//   }
//   destroy(): void {
//     throw new Error("Method not implemented.");
//   }
// }

const testSchema = {
  wow: 123 // why isnt this giving TS error??!?!
}

describe(Reader, () => {
  let reader: Reader;
  // let testySystem1: System;
  // let testySystem2: System;
  // let testySystem3: System;

  // let entityId = 0;
  // let entityId2 = 1;
  // let entityId3 = 2;

  // let queryCallBackFunction: jest.Mock<any, any>;
  // let queryCallBackFunction2: jest.Mock<any, any>;

  // let component: Component;
  // let component2: Component;
  // let component3: Component;

  beforeEach(() => {
    reader = new Reader(testSchema);
    // testySystem1 = new TestySystem(engine);
    // testySystem1.start = jest.fn();
    // testySystem1.update = jest.fn();
    // testySystem2 = new TestySystem(engine);
    // testySystem2.start = jest.fn();
    // testySystem2.update = jest.fn();
    // testySystem3 = new TestySystem(engine);
    // testySystem3.start = jest.fn();
    // testySystem3.update = jest.fn();
    // queryCallBackFunction = jest.fn();
    // queryCallBackFunction2 = jest.fn();
  });

  // describe("#addSystem", () => {
  //   beforeEach(() => {
  //     engine.addSystem(testySystem1);
  //     engine.addSystem(testySystem2);
  //     engine.addSystem(testySystem3);
  //   });

  //   it("calls start() on the system", () => {
  //     expect(testySystem1.start).toBeCalledTimes(1);
  //     expect(testySystem2.start).toBeCalledTimes(1);
  //     expect(testySystem3.start).toBeCalledTimes(1);
  //   });
  // });
});
