import Component from "../../../Component";
import { EntityId } from "../../../types";

class StringComponent extends Component {
  stringNumber: string;

  constructor(entityId: EntityId) {
    super(entityId);
    this.stringNumber = "abc";
  }
}

export default StringComponent;
