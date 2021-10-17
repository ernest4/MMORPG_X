import { ComponentClass, EntityId } from "./types";
import Component from "./Component";
import Engine from "./Engine";

// TODO: entity wrapper ??

// TODO: jest tests !!!!

// TODO: entity api ?
// const entity = this.engine.getEntityByAlias(characterId);
// entity.components.transform.position.xyz = { x, y, z };
// OR
// entity.get.transform.position.xyz = { x, y, z };
// OR
// entity.get<Transform>(Transform).position.xyz = { x, y, z };
// OR
// entity.transform.xyz = { x, y, z }; // should be possible...something like
// constructor(){
// components.forEach(component => (this[component.constructor.name] = component))
// }

// maybe use callback so you dont have to check all the time if
// component present or not? it will either callback or wont
// entity.transform(transform => transform.xyz = { x, y, z });

// could also add engine.queryForEntities()
// that just wraps the query set in entity basically...

// const entityId = this.engine.getEntityIdByAlias(characterId);
// const characterId = this.engine.getAliasIdByEntityId(entityId);
// const component = this.engine.getComponentByAliasEntityId(Character, characterId); // => character.id => entityId
class Entity {
  private _entityId: EntityId;
  private _engine: Engine;
  private _components: { [componentName: string]: Component } = {};

  constructor(entityId: EntityId, engine: Engine) {
    this._entityId = entityId;
    this._engine = engine;
    this.loadComponents(); // TS doesn't like this too much...
    // this._events = {
    //   removedComponent: this._engine.events.removedComponent,
    // };
  }

  get id(): EntityId {
    return this._entityId;
  }

  // TODO: jests
  addComponent = <T extends Component>(callback: (id: EntityId) => T): T => {
    return this._engine.addComponentToEntity(this, callback(this.id));
  };

  // TODO: jests
  addComponents = (callback: (id: EntityId) => Component[]): Component[] => {
    // TODO: check (validate) against internal hash ?
    const components = callback(this.id);
    this._engine.addComponents(...components);
    return components;
  };

  // // TODO: jests
  // removeComponent = (componentClass: ComponentClass) => {
  //   // TODO: check (validate) against internal hash ?
  //   this._engine.removeComponentById(this.id, componentClass);
  // };

  // // TODO: jests
  // removeComponents = (...componentClasses: ComponentClass[]) => {
  //   this._engine.removeComponentsById(this.id, ...componentClasses);
  // };

  // getComponent = <T extends Component>(componentClass: ComponentClass) => {
  //   return this._engine.getComponent<T>(componentClass, this.id);
  // };

  // getComponents = () => this._engine.getComponents(this.id);

  get components() {
    return this._components;
  }

  // TODO: jests
  // TODO: after remove add guard clauses that throw error on any add/remove
  // action after ??
  remove = () => this._engine.removeEntity(this.id);

  // other util methods... ??

  // removeComponent

  // removeAllComponents

  // TODO: jests
  reload = () => {
    this.loadComponents();
  };

  // private ??
  // kinda magic, BUT whats gonna happen if component is remove by system??
  // how will this entity know to update itself?
  // actually the engine should be responsible for that!
  // ALTHOUGH entities are kinda ephemeral...
  // could have loadComponents() method to reinitialize a cached entity if needed?
  private loadComponents = () => {
    const components = this._engine.getAllComponentsOfId(this.id);
    // NOTE: this is totally fine in JS, but TS gets real pissy about undefined methods like that
    // components.forEach(component => {
    //   this[component.constructor.name.toLowerCase()] = component;
    // });

    this._components = {};

    components.forEach(component => {
      this._components[component.constructor.name.toLowerCase()] = component;
    });
  };

  // private ??
  _loadComponent = (component: Component) => {
    this._components[component.constructor.name.toLowerCase()] = component;
  };

  // TODO: jests
  _reloadEntityId = (newEntityId: EntityId) => (this._entityId = newEntityId);
}

export default Entity;
