import { Engine } from "../../shared/ecs";
import System from "../../shared/ecs/System";
import { QuerySet } from "../../shared/ecs/types";
import Transform from "../../shared/components/Transform";
import { TransformMessage as TransformMessageComponent } from "../../shared/messages/schema";

class TransformMessage extends System {
  constructor(engine: Engine) {
    super(engine);
  }

  start(): void {}

  update(): void {
    this.engine.query(this.applyTransformMessage, TransformMessageComponent);
  }

  destroy(): void {}

  private applyTransformMessage = (querySet: QuerySet) => {
    const [transformMessage] = querySet as [TransformMessageComponent];
    const { entityId: entityIdAlias } = transformMessage.parsedMessage;

    const entityId = this.engine.getEntityIdByAlias(<number>entityIdAlias);

    if (entityId) {
      const transform = this.engine.getComponentById(entityId, Transform);
      if (transform) transform.synchronizeFrom(transformMessage.parsedMessage);
    }
  };
}

export default TransformMessage;
