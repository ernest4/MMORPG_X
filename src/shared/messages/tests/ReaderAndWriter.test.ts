const { TextEncoder, TextDecoder } = require("util");
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import { context } from "../../../../tests/jestHelpers";
import OutMessage from "../../components/OutMessage";
import Transform from "../../components/Transform";
import { round } from "../../ecs/utils/Number";
import { MESSAGE_TYPE } from "../schema";
import Reader from "../schema/Reader";
import Writer from "../schema/Writer";

describe("Reader and Writer", () => {
  describe("numbers", () => {
    it("writes and reads int 32", () => {
      const parsedMessage = { messageType: MESSAGE_TYPE.TEST_I32, testNumber: 123 };
      const arrayBuffer = Writer.messageComponentToBinary(new OutMessage(123, parsedMessage));
      const messageComponent = Reader.binaryToMessageComponent(456, arrayBuffer);
      expect(messageComponent.parsedMessage).toEqual(parsedMessage);
    });

    it("writes and reads sequence of numbers", () => {
      const parsedMessage = {
        messageType: MESSAGE_TYPE.TEST_SEQUENCE,
        testUInt8_0: 7,
        testUInt8_1: 8,
        testUInt8_2: 9,
        testUInt8_3: 10,
        testUInt8_4: 3,
      };
      const arrayBuffer = Writer.messageComponentToBinary(new OutMessage(123, parsedMessage));
      const messageComponent = Reader.binaryToMessageComponent(456, arrayBuffer);
      expect(messageComponent.parsedMessage).toEqual(parsedMessage);
    });

    it("writes and reads all number types", () => {
      const parsedMessage = {
        messageType: MESSAGE_TYPE.TEST_NUMBER_TYPES,
        testUInt8_0: 5,
        testUInt16_1: 3000,
        testInt32_2: 8000000,
        testFloat32_3: 5.678765,
      };
      const arrayBuffer = Writer.messageComponentToBinary(new OutMessage(123, parsedMessage));
      const messageComponent = Reader.binaryToMessageComponent(456, arrayBuffer);
      expect(messageComponent.parsedMessage.testUInt8_0).toEqual(parsedMessage.testUInt8_0);
      expect(messageComponent.parsedMessage.testUInt16_1).toEqual(parsedMessage.testUInt16_1);
      expect(messageComponent.parsedMessage.testInt32_2).toEqual(parsedMessage.testInt32_2);
      expect(round(messageComponent.parsedMessage.testFloat32_3, 5)).toEqual(
        round(parsedMessage.testFloat32_3, 5)
      );
    });
  });

  describe("strings", () => {
    it("writes and reads string", () => {
      const parsedMessage = { messageType: MESSAGE_TYPE.TEST_STRING, testString: "testy stringy" };
      const arrayBuffer = Writer.messageComponentToBinary(new OutMessage(123, parsedMessage));
      const messageComponent = Reader.binaryToMessageComponent(456, arrayBuffer);
      expect(messageComponent.parsedMessage).toEqual(parsedMessage);
    });

    it("writes and reads number and string", () => {
      const parsedMessage = {
        messageType: MESSAGE_TYPE.TEST_NUMBER_AND_STRING,
        testUInt16_0: 123,
        testString_1: "testy stringy",
      };
      const arrayBuffer = Writer.messageComponentToBinary(new OutMessage(123, parsedMessage));
      const messageComponent = Reader.binaryToMessageComponent(456, arrayBuffer);
      expect(messageComponent.parsedMessage).toEqual(parsedMessage);
    });
  });

  describe("arrays", () => {
    describe("UInt16 Array", () => {
      it("writes and reads UInt16 Array", () => {
        const parsedMessage = {
          messageType: MESSAGE_TYPE.TEST_U16_ARRAY,
          testU16Array: new Uint16Array([56, 78, 90, 34]),
        };
        const arrayBuffer = Writer.messageComponentToBinary(new OutMessage(123, parsedMessage));
        const messageComponent = Reader.binaryToMessageComponent(456, arrayBuffer);
        expect(messageComponent.parsedMessage.testU16Array).toEqual(parsedMessage.testU16Array);
        expect(messageComponent.parsedMessage.testU16Array.toString()).toEqual(
          parsedMessage.testU16Array.toString()
        );
        expect(messageComponent.parsedMessage.testU16Array).toBeInstanceOf(Uint16Array);
      });

      it("writes and reads number and UInt16 Array", () => {
        const parsedMessage = {
          messageType: MESSAGE_TYPE.TEST_NUMBER_AND_U16_ARRAY,
          testInt32_0: 789,
          testU16Array_1: new Uint16Array([56, 78, 90, 34]),
        };
        const arrayBuffer = Writer.messageComponentToBinary(new OutMessage(123, parsedMessage));
        const messageComponent = Reader.binaryToMessageComponent(456, arrayBuffer);
        expect(messageComponent.parsedMessage).toEqual(parsedMessage);
        expect(messageComponent.parsedMessage.testU16Array_1.toString()).toEqual(
          parsedMessage.testU16Array_1.toString()
        );
      });
    });
  });

  describe("Transform", () => {
    it("writes and reads string", () => {
      const transform = new Transform(123, { x: 1, y: 2, z: 3 });
      const parsedMessage = transform.parsedMessage();
      const arrayBuffer = Writer.messageComponentToBinary(new OutMessage(123, parsedMessage));
      const messageComponent = Reader.binaryToMessageComponent(456, arrayBuffer);
      expect(messageComponent.parsedMessage).toEqual(parsedMessage);
    });
  });
});
