import Component from "../../shared/ecs/Component";
import { EntityId } from "../../shared/ecs/types";

class LoadSprite extends Component {
  constructor(entityId: EntityId) {
    super(entityId);
    // this.frame = 0;
    this._textureUrl = "";
    this._frameWidth = 0;
    this._frameHeight = 0;
  }
}

export default LoadSprite;
