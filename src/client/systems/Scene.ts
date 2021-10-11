import { Engine } from "../../shared/ecs";
import System from "../../shared/ecs/System";
import SceneComponent from "../components/Scene";

class Scene extends System {
  private _phaserGame: Phaser.Game;

  constructor(engine: Engine, phaserGame: Phaser.Game) {
    super(engine);
    this._phaserGame = phaserGame;
  }

  start(): void {
    const mainScene = this._phaserGame.scene.add("main", {});
    const mainSceneComponent = new SceneComponent(this.engine.generateEntityId(), mainScene);
    this.engine.addComponent(mainSceneComponent);
  }

  update(): void {}

  destroy(): void {}
}

export default Scene;
