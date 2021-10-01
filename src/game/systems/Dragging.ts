import { Engine } from "../../ecs";
import System from "../../ecs/System";
import { QuerySet } from "../../ecs/types";
import DragEvent from "../components/DragEvent";
import Transform from "../components/Transform";

class Dragging extends System {
  constructor(engine: Engine) {
    super(engine);
  }

  start(): void {}

  update(): void {
    // apply DragEvent to transform
    this.engine.query(this.updateTransforms, Transform, DragEvent);
  }

  destroy(): void {}

  private updateTransforms = (querySet: QuerySet) => {
    const [transform, dragEvent] = querySet as [Transform, DragEvent];

    transform.position.x = dragEvent.dragX;
    transform.position.y = dragEvent.dragY;
  };
}

export default Dragging;
