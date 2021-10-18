import { Engine } from "../../shared/ecs";
import NetworkedSystem from "../../shared/systems/Networked";
import Networked from "../../shared/components/interfaces/Networked";
import Event from "../../shared/components/interfaces/Event";
import { ComponentClass, QuerySet } from "../../shared/ecs/types";
import SparseSet, { SparseSetItem } from "../../shared/ecs/utils/SparseSet";
import NearbyCharacters from "../components/NearbyCharacters";
import { MESSAGE_TYPE } from "../../shared/messages/schema";

class NetworkedComponentPublisher<T extends MESSAGE_TYPE> extends NetworkedSystem {
  private _networkedComponentClass: ComponentClass<Networked<T>>;
  private _eventComponentClass: ComponentClass<Event>;
  // private _publishedNetworkComponentsSet: SparseSet<Networked<T>>;

  constructor(
    engine: Engine,
    networkedComponentClass: ComponentClass<Networked<T>>,
    eventComponentClass: ComponentClass<Event>
  ) {
    super(engine);
    this._networkedComponentClass = networkedComponentClass;
    this._eventComponentClass = eventComponentClass;
    // this._publishedNetworkComponentsSet = new SparseSet<Networked<T>>();
  }

  start(): void {}

  update(): void {
    this.engine.query(this.createOutMessages, this._eventComponentClass);
  }

  destroy(): void {}

  // TODO: check for tracking ccomponeent
  // fetch tracked component
  // ccheck if outmeessage eexists, if it does, ddont duplicate it
  // otherwise, create one

  private createOutMessages = (querySet: QuerySet) => {
    const [{ targetEntityId }] = querySet as [Event];

    const [nearbyCharacters, networkedComponent] = <[NearbyCharacters, Networked<T>]>(
      this.engine.getComponentsById(targetEntityId, NearbyCharacters, this._networkedComponentClass)
    );

    this.addOutMessageComponent(networkedComponent);

    nearbyCharacters.entityIdSet.stream(({ id: nearbyCharacterEntityId }: SparseSetItem) => {
      this.addOutMessageComponent(networkedComponent, nearbyCharacterEntityId);
    });
  };
}

export default NetworkedComponentPublisher;
