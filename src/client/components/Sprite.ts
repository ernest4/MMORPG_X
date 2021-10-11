import Component from "../../shared/ecs/Component";
import { EntityId } from "../../shared/ecs/types";

class Sprite extends Component {
  phaserSprite: Phaser.GameObjects.Sprite;

  constructor(entityId: EntityId, phaserSprite: Phaser.GameObjects.Sprite) {
    super(entityId);
    // this.frame = 0;
    // this._textureUrl = "";
    // this._frameWidth = 0;
    // this._frameHeight = 0;
    this.phaserSprite = phaserSprite;
  }
}

export default Sprite;
