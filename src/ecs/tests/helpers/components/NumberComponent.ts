import Component from "../../../Component";
import { EntityId } from "../../../types";

class NumberComponent extends Component {
  testNumber: number;

  constructor(entityId: EntityId) {
    super(entityId);
    this.testNumber = 5;
  }
}

export default NumberComponent;
