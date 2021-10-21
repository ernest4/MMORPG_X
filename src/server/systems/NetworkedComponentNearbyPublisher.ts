import { Engine } from "../../shared/ecs";
import Publisher from "../../shared/systems/Publisher";
import Networked from "../../shared/components/interfaces/Networked";
import Event from "../../shared/components/interfaces/Event";
import { ComponentClass, EntityId, QuerySet } from "../../shared/ecs/types";
import SparseSet, { SparseSetItem } from "../../shared/ecs/utils/SparseSet";
import NearbyCharacters from "../components/NearbyCharacters";
import { MESSAGE_TYPE } from "../../shared/messages/schema";

class NetworkedComponentNearbyPublisher<T extends MESSAGE_TYPE> extends Publisher {
  private _networkedComponentClass: ComponentClass<Networked<T>>;
  private _eventComponentClasses: ComponentClass<Event>[];
  private _publishedTargetEntityIdsSet: SparseSet<SparseSetItem>;

  constructor(
    engine: Engine,
    networkedComponentClass: ComponentClass<Networked<T>>,
    eventComponentClasses: ComponentClass<Event>[]
  ) {
    super(engine);
    this._networkedComponentClass = networkedComponentClass;
    this._eventComponentClasses = eventComponentClasses;
    this._publishedTargetEntityIdsSet = new SparseSet<SparseSetItem>();
  }

  start(): void {}

  update(): void {
    this._publishedTargetEntityIdsSet.clear();
    this._eventComponentClasses.forEach(this.queryForEventComponentClass);
  }

  destroy(): void {}

  private queryForEventComponentClass = (eventComponentClass: ComponentClass<Event>) => {
    this.engine.query(this.createOutMessages, eventComponentClass);
  };

  private createOutMessages = (querySet: QuerySet) => {
    const [{ targetEntityId }] = querySet as [Event];

    if (this.isPublished(targetEntityId)) return;

    const [nearbyCharacters, networkedComponent] = <[NearbyCharacters, Networked<T>]>(
      this.engine.getComponentsById(targetEntityId, NearbyCharacters, this._networkedComponentClass)
    );

    if (!nearbyCharacters) return;
    if (!networkedComponent) return;

    // TODO: maybe above can use some utility helper like:
    // withPresentItems((nearbyCharacters, networkedComponent) => {
    //   // callback if all items present
    // }, nearbyCharacters, networkedComponent)
    // OR
    // if areBlank(nearbyCharacters, networkedComponent) return;

    this.addOutMessageComponent(networkedComponent);

    nearbyCharacters.entityIdSet.stream(({ id: nearbyCharacterEntityId }: SparseSetItem) => {
      this.addOutMessageComponent(networkedComponent, nearbyCharacterEntityId);
    });

    this.markPublished(targetEntityId);
  };

  private isPublished = (targetEntityId: EntityId): boolean => {
    return !!this._publishedTargetEntityIdsSet.get(targetEntityId);
  };

  private markPublished = (targetEntityId: EntityId): void => {
    this._publishedTargetEntityIdsSet.add(new SparseSetItem(targetEntityId));
  };
}

export default NetworkedComponentNearbyPublisher;
