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

    // entity.transform.xyz = { x, y, z }; // should be possible...something like
    // constructor(){
    // components.forEach(component => (this[component.constructor.name] = component))
    // }
    // kinda magic, BUT whats gonna happen if component is remove by system??
    // how will this entity know to update itself?
    // actually the engine should be responsible for that!
    // ALTHOUGH entities are kinda ephemeral...
    // could have loadComponents() method to reinitialize a cached entity if needed?
    this.loadComponents()
  }

  get id(): EntityId {
    return this._entityId;
  }

  // addComponent = (component: Component): Component => {
  //   return this._engine.addComponent(component);
  // };

  addComponent = (assignmentCallback: (id: EntityId) => Component): Component => {
    return this._engine.addComponent(assignmentCallback(this._entityId));
  };
  // usage entity.addComponent(id => new Transform(id, ... other params));

  // other util methods... ??

  // removeComponent

  // removeAllComponents

  loadComponents = () => {
    // TODO:
    // entity.transform.xyz = { x, y, z }; // should be possible...something like
    // constructor(){
    // components.forEach(component => (this[component.constructor.name] = component))
    // }
  }
}

export default Entity;
