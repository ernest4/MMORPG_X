import { ComponentClass, EntityId } from "./types";
import Component from "./Component";
import Engine from "./Engine";

// TODO: entity wrapper ??

// TODO: jest tests !!!!
class Entity {
  private _entityId: EntityId;
  private _engine: Engine;
  components: { [componentName: string]: Component };

  constructor(entityId: EntityId, engine: Engine) {
    this._entityId = entityId;
    this._engine = engine;
    // this.loadComponents(); // TS doesn't like this too much...
  }

  get id(): EntityId {
    return this._entityId;
  }

  // TODO: jests
  addComponent = (callback: (id: EntityId) => Component): Component => {
    return this._engine.addComponent(callback(this._entityId));
  };

  // TODO: jests
  addComponents = (callback: (id: EntityId) => Component[]): Component[] => {
    const components = callback(this._entityId);
    this._engine.addComponents(...components);
    return components;
  };

  // TODO: jests
  removeComponent = (componentClass: ComponentClass) => {
    this._engine.removeComponentById(this.id, componentClass);
  };

  // TODO: jests
  removeComponents = (...componentClasses: ComponentClass[]) => {
    this._engine.removeComponentsById(this.id, ...componentClasses);
  };

  getComponent = <T extends Component>(componentClass: ComponentClass) => {
    return this._engine.getComponent<T>(componentClass, this.id);
  };

  // TODO: jests
  getComponents = () => this._engine.getComponents(this.id);

  // TODO: jests
  remove = () => this._engine.removeEntity(this.id);

  // other util methods... ??

  // removeComponent

  // removeAllComponents

  // // kinda magic, BUT whats gonna happen if component is remove by system??
  // // how will this entity know to update itself?
  // // actually the engine should be responsible for that!
  // // ALTHOUGH entities are kinda ephemeral...
  // // could have loadComponents() method to reinitialize a cached entity if needed?
  // loadComponents = () => {
  //   const components = this._engine.getComponents(this.id);
  //   // NOTE: this is totally fine in JS, but TS gets real pissy about undefined methods like that
  //   components.forEach(component => {
  //     this[component.constructor.name.toLowerCase()] = component;
  //   });
  // };
}

export default Entity;
