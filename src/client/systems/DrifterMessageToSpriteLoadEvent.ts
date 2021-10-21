import { Engine } from "../../shared/ecs";
import System from "../../shared/ecs/System";
import Drifter from "../../shared/components/characterTypes/Drfiter";
import { DrifterMessage } from "../../shared/messages/schema";
import { QuerySet } from "../../shared/ecs/types";
import { Sprite } from "../components";
import LoadSpriteEvent from "../components/LoadSpriteEvent";

class DrifterMessageToSpriteLoadEvent extends System {
  constructor(engine: Engine) {
    super(engine);
  }

  start(): void {}

  update(): void {
    this.engine.query(this.createSpriteLoadEvents, Drifter, DrifterMessage);
  }

  destroy(): void {}

  private createSpriteLoadEvents = (querySet: QuerySet) => {
    const [drifter, drifterMessage] = querySet as [Drifter, DrifterMessage];

    this.log(drifter);
    const sprite = this.engine.getComponentById(drifter.entityId, Sprite);
    if (sprite) return;

    const spriteLoadEvent = new LoadSpriteEvent(
      this.newEntityId(),
      "assets/images/unit_T.png",
      { frameWidth: 32 },
      drifter.entityId
    );
    this.engine.addComponent(spriteLoadEvent);
  };
}

export default DrifterMessageToSpriteLoadEvent;
