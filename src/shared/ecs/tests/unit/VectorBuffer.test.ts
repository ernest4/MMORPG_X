import { context } from "../../../../../tests/jestHelpers";
import VectorBuffer, { VectorBufferItem } from "../../utils/VectorBuffer";

describe(VectorBuffer, () => {
  let vectorBufferItem1: VectorBufferItem;
  let vectorBufferItem2: VectorBufferItem;
  let vectorBufferItem3: VectorBufferItem;

  const arrayBuffer1 = new ArrayBuffer(2);
  new Uint8Array(arrayBuffer1)[0] = 1;
  const arrayBuffer2 = new ArrayBuffer(2);
  new Uint8Array(arrayBuffer2)[0] = 1;
  const arrayBuffer3 = new ArrayBuffer(2);
  new Uint8Array(arrayBuffer3)[0] = 1;

  let subject: VectorBuffer;

  beforeEach(() => {
    subject = new VectorBuffer(4, arrayBuffer1.byteLength);

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
      expect(subject.get(0)).toEqual(vectorBufferItem1);
      
      expect(subject.get(1)).toEqual(vectorBufferItem2);
    });

    // it("returns the added item", () => {
    //   expect(addResult).toEqual(vectorBufferItem3);
    // });

    it("increases size", () => {
      expect(subject.size).toEqual(previousSizeBeforeAdd + 2);
    });

    context("when item can still fit", () => {
      // TODO: .. doeesnt grow
    });

    context("when item can't fit", () => {
      // TODO: .. grows
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

  // describe("#stream", () => {
  //   beforeEach(() => subject.push(vectorBufferItem3));

  //   it("streams all the items", () => {
  //     let items: any[] = [];

  //     subject.stream((item: any) => items.push(item));
  //     expect(items).toEqual([vectorBufferItem1, vectorBufferItem2, vectorBufferItem3]);

  //     subject.remove(vectorBufferItem2);

  //     items = [];
  //     subject.stream((item: any) => items.push(item));
  //     expect(items).toEqual([vectorBufferItem1, vectorBufferItem3]);
  //   });
  // });

  describe("benckmarks", () => {
    // TOOD: ...iteration speed...
    // BENCHMARK
    // const t0 = performance.now();
    // doSomething();
    // const t1 = performance.now();
    // console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
  });
});
