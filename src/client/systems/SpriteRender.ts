import Transform from "../../shared/components/Transform";
import { Engine } from "../../shared/ecs";
import System from "../../shared/ecs/System";
import { QuerySet } from "../../shared/ecs/types";
import Sprite from "../components/Sprite";

class SpriteRender extends System {
  constructor(engine: Engine) {
    super(engine);
  }

  start(): void {}

  update(): void {
    this.engine.query(this.updateSprites, Transform, Sprite);
  }

  destroy(): void {}

  private updateSprites = (querySet: QuerySet) => {
    const [{ position, rotation, scale }, { phaserSprite }] = querySet as [Transform, Sprite];

    phaserSprite.x = position.x;
    phaserSprite.y = position.y;
    this.log(phaserSprite.x); // TODO: remove

    phaserSprite.angle = rotation.z;

    phaserSprite.scaleX = scale.x;
    phaserSprite.scaleY = scale.y;
  };
}

export default SpriteRender;
