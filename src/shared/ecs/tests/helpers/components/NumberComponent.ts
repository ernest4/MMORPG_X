import Component from "../../../Component";
import { EntityId } from "../../../types";

class NumberComponent extends Component {
  testNumber: number;

  constructor(entityId: EntityId, testNumber?: number) {
    super(entityId);
    this.testNumber = testNumber || 5;
  }
}

export default NumberComponent;
