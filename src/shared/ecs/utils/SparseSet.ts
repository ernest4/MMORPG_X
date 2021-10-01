import { isNumber } from "./Number";

export class SparseSetItem {
  private _id: number;

  constructor(id: number) {
    this._id = id;
  }

  get id(): number {
    return this._id;
  }

  set id(newId: number) {
    this._id = newId;
  }
}

class SparseSet {
  // TODO: will want to optimize these lists to use ArrayBuffer for dense memory access where
  // possible?
  private _denseList: SparseSetItem[];
  // TODO: Sparse lists will become hash maps in V8 optimizer. They are less efficient in speed
  // compared to arrays. So maybe use fixed size ArrayBuffer as well? Dynamically grow it yourself?
  private _sparseList: number[];
  private _elementCount: number;

  constructor() {
    // constructor(sparseSetMaxValue, denseSetCapacity) {
    // sparse = new int[maxV + 1]();
    // dense = new int[cap]();
    // capacity = cap;
    // maxValue = maxV;
    // n = 0; // No elements initially
    // this._objectIdKeyName = objectIdKeyName;

    this._sparseList = [];
    this._denseList = [];
    this._elementCount = 0; // No elements initially
  }

  get = (id: number): SparseSetItem | null => {
    // Searched element must be in range
    // if (x > maxValue) return -1;

    // The first condition verifies that 'x' is
    // within 'n' in this set and the second
    // condition tells us that it is present in
    // the data structure.

    const denseListIndex = this._sparseList[id];

    if (this._elementCount <= denseListIndex) return null;
    if (this._denseList[denseListIndex]?.id !== id) return null;

    return this._denseList[denseListIndex];
  };

  // Inserts a new element into set
  add = (item: SparseSetItem) => {
    const itemId = item.id;

    //  Corner cases, x must not be out of
    // range, dense[] should not be full and
    // x should not already be present
    // if (x > maxValue) return;
    // if (n >= capacity) return;
    if (this.get(itemId) !== null) return;

    // Inserting into array-dense[] at index 'n'.
    this._denseList[this._elementCount] = item;

    // Mapping it to sparse[] array.
    this._sparseList[itemId] = this._elementCount;

    // Increment count of elements in set
    this._elementCount++;
  };

  // A function that deletes 'x' if present in this data
  // structure, else it does nothing (just returns).
  // By deleting 'x', we unset 'x' from this set.
  remove = (item: SparseSetItem | number): number | null => {
    const itemId = isNumber(item) ? (item as number) : (item as SparseSetItem).id;

    // If x is not present
    if (this.get(itemId) === null) return null;

    const denseListIndex = this._sparseList[itemId];

    const lastItem = this._denseList[this._elementCount - 1]; // Take an element from end
    this._denseList[denseListIndex] = lastItem; // Overwrite.
    this._sparseList[lastItem.id] = denseListIndex; // Overwrite.

    // Since one element has been deleted, we
    // decrement 'n' by 1.
    this._elementCount--;

    return itemId; // return removed item id
  };

  clear = () => (this._elementCount = 0);

  get size() {
    return this._elementCount;
  }

  stream = (callback: Function) => {
    for (let i = 0; i < this._elementCount; i++) callback(this._denseList[i]);
  };

  *streamIterator() {
    for (let i = 0; i < this._elementCount; i++) yield this._denseList[i];
  }
}

export default SparseSet;
