import Component from "../../ecs/Component";
import { EntityId } from "../../ecs/types";

// TODO: create parent 'LoadableComponent/AsyncComponent extends Component' that contains the common 'loaded' boolean ??
class Sprite extends Component {
  private _textureUrl: string;
  private _frameWidth: number;
  private _frameHeight: number;
  frame: number;
  loaded: boolean;
  phaserSpriteRef: Phaser.GameObjects.Sprite | undefined; // NOTE: this should be ignored / discarded by any serializer

  constructor(entityId: EntityId) {
    super(entityId, true);
    this.frame = 0;
    this.loaded = false;
    this._textureUrl = "";
    this._frameWidth = 0;
    this._frameHeight = 0;
  }

  set textureUrl(value: string) {
    this.loaded = false; // NOTE: mark dirty
    this._textureUrl = value;
  }

  get textureUrl() {
    return this._textureUrl;
  }

  set frameWidth(value: number) {
    this.loaded = false; // NOTE: mark dirty
    this._frameWidth = value;
  }

  get frameWidth() {
    return this._frameWidth;
  }

  set frameHeight(value: number) {
    this.loaded = false; // NOTE: mark dirty
    this._frameHeight = value;
  }

  get frameHeight() {
    return this._frameHeight;
  }
}

export default Sprite;
