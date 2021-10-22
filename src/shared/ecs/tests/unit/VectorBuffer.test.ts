import { context } from "../../../../../tests/jestHelpers";
import VectorBuffer, { VectorBufferItem } from "../../utils/VectorBuffer";

describe(VectorBuffer, () => {
  let initialItemCapacity = 4;
  let vectorBufferItem1: VectorBufferItem;
  let vectorBufferItem2: VectorBufferItem;
  let vectorBufferItem3: VectorBufferItem;

  const arrayBuffer1 = new ArrayBuffer(2);
  new Uint8Array(arrayBuffer1)[0] = 1;
  const arrayBuffer2 = new ArrayBuffer(2);
  new Uint8Array(arrayBuffer2)[0] = 2;
  const arrayBuffer3 = new ArrayBuffer(2);
  new Uint8Array(arrayBuffer3)[0] = 3;

  let subject: VectorBuffer;

  beforeEach(() => {
    subject = new VectorBuffer(initialItemCapacity, arrayBuffer1.byteLength);

    vectorBufferItem1 = new VectorBufferItem(arrayBuffer1);
    vectorBufferItem2 = new VectorBufferItem(arrayBuffer2);
    vectorBufferItem3 = new VectorBufferItem(arrayBuffer3);

    // subject.push(vectorBufferItem1);
    // subject.push(vectorBufferItem2);
  });

  describe("#push", () => {
    let previousSizeBeforeAdd: number;
    let previousSizeAfterAdd: number;
    let addResult1;
    let addResult2;

    beforeEach(() => {
      previousSizeBeforeAdd = subject.size;
      addResult1 = subject.push(vectorBufferItem1);
      addResult2 = subject.push(vectorBufferItem2);
      previousSizeAfterAdd = subject.size;
    });

    it("adds the item", () => {
      expect(subject.get(0).toArrayBuffer()).toEqual(vectorBufferItem1.toArrayBuffer());
      expect(subject.get(1).toArrayBuffer()).toEqual(vectorBufferItem1.toArrayBuffer());
    });

    it("returns the added item", () => {
      expect(addResult1.toArrayBuffer()).toEqual(vectorBufferItem1.toArrayBuffer());
    });

    it("increases size", () => {
      expect(subject.size).toEqual(previousSizeBeforeAdd + 2);
    });

    context("when item can still fit", () => {
      it("does not increase capacity", () => {
        expect(subject.capacity).toEqual(initialItemCapacity);
      });
    });

    context("when item can't fit", () => {
      beforeEach(() => {
        subject.push(vectorBufferItem1);
        subject.push(vectorBufferItem1);
        subject.push(vectorBufferItem1);
      });

      it("does increases capacity", () => {
        expect(subject.capacity).toEqual(initialItemCapacity * 2);
      });

      it("adds the item", () => {
        expect(subject.get(4).toArrayBuffer()).toEqual(vectorBufferItem1.toArrayBuffer());
      });
    });
  });

  // describe("#get", () => {
  //   let getComponentForEntity: SparseSetItem | null;

  //   beforeEach(() => (getComponentForEntity = subject.get(entityId1)));

  //   context("when entity has the component", () => {
  //     it("returns the component", () => {
  //       expect(getComponentForEntity).toBe(vectorBufferItem1);
  //       expect(getComponentForEntity?.id).toEqual(entityId1);
  //     });
  //   });

  //   context("when entity does not have the component", () => {
  //     beforeEach(() => (subject = new SparseSet()));

  //     context("when component never existed", () => {
  //       it("returns null", () => {
  //         expect(subject.get(entityId1)).toEqual(null);
  //       });
  //     });

  //     context("when component was added", () => {
  //       beforeEach(() => {
  //         vectorBufferItem1 = new NumberComponent(entityId1);
  //         vectorBufferItem2 = new NumberComponent(entityId2);

  //         subject.push(vectorBufferItem1);
  //         subject.push(vectorBufferItem2);
  //       });

  //       context("when component was removed", () => {
  //         beforeEach(() => subject.remove(vectorBufferItem1));

  //         it("returns null", () => {
  //           expect(subject.get(entityId1)).toEqual(null);
  //         });
  //       });

  //       context("when all components were cleared", () => {
  //         beforeEach(() => subject.clear());

  //         it("returns null", () => {
  //           expect(subject.get(entityId1)).toEqual(null);
  //         });
  //       });
  //     });
  //   });
  // });

  // describe("#remove", () => {
  //   context("when entity has the component", () => {
  //     let previousSize: number;

  //     beforeEach(() => (previousSize = subject.size));

  //     it("returns removed component's original entityId", () => {
  //       expect(subject.remove(vectorBufferItem1)).toEqual(entityId1);
  //     });

  //     it("allows you to remove component by id", () => {
  //       expect(subject.remove(entityId1)).toEqual(entityId1);
  //     });

  //     it("reduces list size", () => {
  //       subject.remove(vectorBufferItem1);
  //       expect(subject.size).toEqual(previousSize - 1);
  //     });
  //   });

  //   context("when entity does not have the component", () => {
  //     beforeEach(() => {
  //       subject = new SparseSet();
  //       vectorBufferItem1 = new NumberComponent(entityId1);
  //     });

  //     context("when component never existed", () => {
  //       it("returns null", () => {
  //         expect(subject.remove(vectorBufferItem1)).toEqual(null);
  //       });
  //     });

  //     context("when component was added", () => {
  //       beforeEach(() => {
  //         vectorBufferItem1 = new NumberComponent(entityId1);
  //         vectorBufferItem2 = new NumberComponent(entityId2);

  //         subject.push(vectorBufferItem1);
  //         subject.push(vectorBufferItem2);
  //       });

  //       context("when component was removed", () => {
  //         beforeEach(() => subject.remove(vectorBufferItem1));

  //         context("when removing it again", () => {
  //           it("returns null", () => {
  //             expect(subject.remove(vectorBufferItem1)).toEqual(null);
  //           });
  //         });

  //         context("when removing a component with same entityId (before it was even added)", () => {
  //           it("returns null", () => {
  //             expect(subject.remove(new NumberComponent(entityId1))).toEqual(null);
  //           });
  //         });
  //       });

  //       context("when all components were cleared", () => {
  //         beforeEach(() => subject.clear());

  //         it("returns null", () => {
  //           expect(subject.remove(vectorBufferItem1)).toEqual(null);
  //         });
  //       });
  //     });
  //   });
  // });

  // describe("#clear", () => {
  //   beforeEach(() => subject.clear());

  //   it("sets the size to 0", () => {
  //     expect(subject.size).toEqual(0);
  //   });

  //   it("makes existing components inaccessible", () => {
  //     expect(subject.get(entityId1)).toEqual(null);
  //     expect(subject.get(entityId2)).toEqual(null);
  //   });
  // });

  // describe("#size", () => {
  //   it("returns the number of components in the list", () => {
  //     expect(subject.size).toEqual(2);

  //     subject.push(vectorBufferItem3);
  //     expect(subject.size).toEqual(3);

  //     subject.remove(vectorBufferItem1);
  //     expect(subject.size).toEqual(2);

  //     subject.remove(vectorBufferItem2);
  //     expect(subject.size).toEqual(1);

  //     subject.remove(vectorBufferItem3);
  //     expect(subject.size).toEqual(0);
  //   });
  // });

  describe("#each", () => {
    beforeEach(() => {
      subject.push(vectorBufferItem1);
      subject.push(vectorBufferItem2);
      subject.push(vectorBufferItem3);
      subject.push(vectorBufferItem1);
    });

    it("iterates over all the items", () => {
      let items: any[] = [];

      subject.each((item: VectorBufferItem) => items.push(item.toArrayBuffer()));
      expect(items).toEqual([
        vectorBufferItem1.toArrayBuffer(),
        vectorBufferItem2.toArrayBuffer(),
        vectorBufferItem3.toArrayBuffer(),
        vectorBufferItem1.toArrayBuffer(),
      ]);

      // TODO: remove case
      // subject.remove(vectorBufferItem2);

      // items = [];
      // subject.each((item: any) => items.push(item));
      // expect(items).toEqual([vectorBufferItem1, vectorBufferItem3]);
    });
  });

  describe("benckmarks", () => {
    it("runs benchmarks", () => {
      const numbersArraySize = 1000000;
      const numbersArray = [];
      const vectorBuffer = new VectorBuffer(1, 4);
      for (let i = 0; i < numbersArraySize; i++) {
        numbersArray[i] = i;

        const uint32Array = new Uint32Array(1);
        uint32Array[0] = i;
        vectorBuffer.push(new VectorBufferItem(uint32Array.buffer));
      }

      benchmark("Array", () => {
        numbersArray.forEach(i => i);
      });

      benchmark("VectorBuffer", () => {
        vectorBuffer.each(i => i);
      });
    });
  });
});

const benchmark = (subject: string, callback: Function) => {
  const t0 = performance.now();
  callback();
  const t1 = performance.now();
  console.log(`${subject} took ${t1 - t0} milliseconds.`);
};
