import { context } from "../../../../tests/testAliases";
import { isNumber } from "../../utils/Number";

describe(isNumber, () => {
  context("when argument is number", () => {
    it("returns true", () => {
      expect(isNumber(5)).toEqual(true);
      expect(isNumber(5.89)).toEqual(true);
    });
  });

  context("when argument is not a number", () => {
    it("returns true", () => {
      expect(isNumber("6")).toEqual(false);
      expect(isNumber("6.78")).toEqual(false);
      expect(isNumber(null)).toEqual(false);
      expect(isNumber(undefined)).toEqual(false);
      expect(isNumber({})).toEqual(false);
      expect(isNumber([])).toEqual(false);
      expect(isNumber(() => {})).toEqual(false);
    });
  });
});
