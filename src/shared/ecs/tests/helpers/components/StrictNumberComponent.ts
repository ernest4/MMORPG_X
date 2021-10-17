import Component from "../../../Component";
import { EntityId } from "../../../types";

class StrictNumberComponent extends Component {
  testNumber: number;

  constructor(entityId: EntityId, testNumber: number) {
    super(entityId);
    this.testNumber = testNumber;
  }
}

export default StrictNumberComponent;
