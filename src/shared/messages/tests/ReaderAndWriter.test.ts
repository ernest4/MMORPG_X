import { context } from "../../../../tests/jestHelpers";
import OutMessage from "../../components/OutMessage";
import { MESSAGE_TYPE } from "../schema";
import Reader from "../schema/Reader";
import Writer from "../schema/Writer";
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

describe("Reader and Writer", () => {
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

  describe("numbers", () => {
    beforeEach(() => {
      // TODO: ...
    });

    it("writes and reads int 32", () => {
      const parsedMessage = { messageType: MESSAGE_TYPE.TEST_I32, testNumber: 123 };
      const arrayBuffer = Writer.messageComponentToBinary(new OutMessage(123, parsedMessage));
      const messageComponent = Reader.binaryToMessageComponent(456, arrayBuffer);
      expect(messageComponent.parsedMessage).toEqual(parsedMessage);
    });

    it("writes and reads sequence of numbers", () => {
      const parsedMessage = {
        messageType: MESSAGE_TYPE.TEST_NUMBERS,
        testUInt8: 5,
      };
      const arrayBuffer = Writer.messageComponentToBinary(new OutMessage(123, parsedMessage));
      const messageComponent = Reader.binaryToMessageComponent(456, arrayBuffer);
      expect(messageComponent.parsedMessage).toEqual(parsedMessage);
    });
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
