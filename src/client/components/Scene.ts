import Component from "../../shared/ecs/Component";
import { EntityId } from "../../shared/ecs/types";
import Phaser from "phaser";

// TODO: optimize with ArrayBuffers ??
class Scene extends Component {
  scene: Phaser.Scene;

  constructor(entityId: EntityId, scene: Phaser.Scene) {
    super(entityId);
    this.scene = scene;
  }
}

export default Scene;
