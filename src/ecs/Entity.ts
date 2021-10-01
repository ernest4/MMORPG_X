import { EntityId } from "./types";
import Component from "./Component";
import Engine from "./Engine";

// TODO: entity wrapper ??

// TODO: jest tests !!!!
class Entity {
  private _entityId: EntityId;
  private _engine: Engine;

  constructor(entityId: EntityId, engine: Engine) {
    this._entityId = entityId;
    this._engine = engine;

    // TODO: store entity refs so can loop through that when removing? faster than engine looping
    // through all component lists.
  }

  get entityId(): EntityId {
    return this._entityId;
  }

  // addComponent = (component: Component): Component => {
  //   return this._engine.addComponent(component);
  // };

  addComponent = (assignmentFunction: (id: EntityId) => Component): Component => {
    return this._engine.addComponent(assignmentFunction(this._entityId));
  };
  // usage entity.addComponent(id => new Transform(id, ... other params));

  // other util methods... ??

  // removeComponent

  // removeAllComponents
}

export default Entity;
