import { context } from "../../../../tests/testAliases";
import EntityIdPool from "../../engine/EntityIdPool";

describe(EntityIdPool, () => {
  let subject: EntityIdPool;

  beforeEach(() => {
    subject = new EntityIdPool();
  });

  describe("#getId", () => {
    context("when pool is empty", () => {
      it("generates new ids, starting at 0 and pool size doesn't grow", () => {
        expect(subject.getId()).toEqual(0);
        expect(subject.size).toEqual(0);

        expect(subject.getId()).toEqual(1);
        expect(subject.size).toEqual(0);

        expect(subject.getId()).toEqual(2);
        expect(subject.size).toEqual(0);
      });
    });

    context("when pool has reclaimed some ids", () => {
      it("uses the pool, once pool exhausted, generates new ids", () => {
        [0, 1, 2, 3, 4, 5].forEach(id => {
          expect(subject.getId()).toEqual(id);
          expect(subject.size).toEqual(0);
        });

        subject.reclaimId(1);
        expect(subject.size).toEqual(1);

        subject.reclaimId(4);
        expect(subject.size).toEqual(2);

        subject.reclaimId(5);
        expect(subject.size).toEqual(3);

        expect(subject.getId()).toEqual(5);
        expect(subject.size).toEqual(2);

        expect(subject.getId()).toEqual(4);
        expect(subject.size).toEqual(1);

        expect(subject.getId()).toEqual(1);
        expect(subject.size).toEqual(0);

        expect(subject.getId()).toEqual(6);
        expect(subject.size).toEqual(0);

        expect(subject.getId()).toEqual(7);
        expect(subject.size).toEqual(0);
      });
    });
  });

  describe("#clear", () => {
    beforeEach(() => {
      [subject.getId(), subject.getId(), subject.getId()].forEach(id => {
        subject.reclaimId(id);
      });
    });

    it("returns pool size", () => {
      expect(subject.clear()).toEqual(3);
    });

    it("sets size to 0", () => {
      subject.clear();
      expect(subject.size).toEqual(0);
    });

    it("generates a new id", () => {
      subject.clear();
      expect(subject.getId()).toEqual(0);
    });
  });
});
