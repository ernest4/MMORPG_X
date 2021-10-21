import { ComponentClass, DeltaTime, EntityId, QueryCallback, QuerySet } from "./types";
import EntityIdPool, { EntityIdPoolParams } from "./engine/EntityIdPool";
import Component from "./Component";
import SparseSet, { SparseSetItem } from "./utils/SparseSet";
import System from "./System";
import { isNumber } from "./utils/Number";
import Entity from "./Entity";

// TODO: move out to own class?
class EntityIdAlias extends SparseSetItem {
  entityId: EntityId;

  constructor(aliasId: EntityId, entityId: EntityId) {
    super(aliasId);
    this.entityId = entityId;
  }
}

// TODO: jest tests !!!!
class Engine {
  private _deltaTime: DeltaTime;
  private _updating: boolean;
  // updateComplete: any; // TODO: better type?
  // NOTE: for faster iteration, reference straight to update function, one indirection instead of 2
  // (-> system -> update)
  // _systemUpdateFunctions: ((engine: Engine, deltaTime: DeltaTime) => void)[];
  private _systems: System[]; // NOTE: handle onn system to call start() and destroy()
  private _componentLists: { [key: string]: SparseSet<Component> };
  private _debug: boolean | undefined;
  private _entityIdAliases: SparseSet<EntityIdAlias>;
  readonly entityIdPool: EntityIdPool;

  constructor(debug?: boolean) {
    this._debug = debug;
    // this._systemUpdateFunctions = [];
    this._systems = [];
    this._deltaTime = 0;
    this._updating = false;
    this._componentLists = {};
    // this.updateComplete = new signals.Signal(); // TODO: signals?? https://github.com/millermedeiros/js-signals
    this.entityIdPool = new EntityIdPool();
    this._entityIdAliases = new SparseSet();
    // this._events = {
    //   removedComponent: (component: Component, oldEntityId: EntityId) => {},
    // };
  }

  // TODO: jests
  serialize = () => {
    // TODO: serialize entityId pool & all serializable components
    // TODO: serialize _entityIdAliases too ?!?
  };

  // TODO: jests
  deserialize = () => {
    // TODO: deserialize entityId pool & all serializable components
    // TODO: deserialize _entityIdAliases too ?!?
  };

  addSystem = (system: System) => {
    // addSystem = (system: System, priority?: number) => {
    // TODO: priority integer sorting
    // simple priority based on insertion order for now...
    // this._systemUpdateFunctions.push(system.update);
    this._systems.push(system);
    system.start();

    if (this._debug) console.log(`[Engine]: Started system: ${system.constructor.name}`);
  };

  // TODO: jests
  addSystems = (...systems: System[]) => systems.forEach(this.addSystem);

  // getSystem

  // removeSystem
  // () => { ... system.destroy()}

  // removeAllSystems

  addComponent = <T extends Component>(component: T) => {
    // NOTE: indexing using component class name
    const componentClassName = component.constructor.name;
    let componentList = this._componentLists[componentClassName];

    if (!componentList) {
      componentList = new SparseSet();
      this._componentLists[componentClassName] = componentList;
    }

    componentList.add(component);
    return component;
  };

  addComponents = (...components: Component[]) => components.forEach(this.addComponent);

  // TODO: sketches...
  addComponentToEntity = <T extends Component>(entity: Entity, component: T) => {
    entity._loadComponent(component); // TODO: maybe call reload() sticking to public api? but it's expensive, will loop through all component lists...
    return this.addComponent(component);
  };

  removeComponent = (component: Component) => {
    // NOTE: indexing using component class name
    const componentClassName = component.constructor.name;
    const componentList = this._componentLists[componentClassName];
    if (!componentList) return;

    const oldEntityId = component.id;
    // this._events.removedComponent(component, oldEntityId);
    componentList.remove(component);
    if (isNumber(oldEntityId)) this.reclaimEntityIdIfFree(oldEntityId);
  };

  removeComponents = (...components: Component[]) => components.forEach(this.removeComponent);

  removeComponentById = <T extends Component>(
    entityId: EntityId,
    componentClass: ComponentClass<T>
  ) => {
    const componentList = this._componentLists[componentClass.name];
    if (!componentList) return;

    componentList.remove(entityId);
    if (isNumber(entityId)) this.reclaimEntityIdIfFree(entityId);
  };

  removeComponentsById = (entityId: EntityId, ...componentClasses: ComponentClass<any>[]) => {
    const callback = (componentClass: ComponentClass<any>) => {
      this.removeComponentById(entityId, componentClass);
    };
    componentClasses.forEach(callback);
  };

  removeComponentsOfClass = <T extends Component>(componentClass: ComponentClass<T>) => {
    this._componentLists[componentClass.name]?.stream(this.removeComponent);
  };

  removeComponentsOfClasses = (...componentClasses: ComponentClass<any>[]) => {
    componentClasses.forEach(this.removeComponentsOfClass);
  };

  getComponentById = <T extends Component>(
    entityId: EntityId,
    componentClass: ComponentClass<T>
  ) => {
    return this._componentLists[componentClass.name]?.get(entityId) as T | null;
  };

  getComponentsById = (
    entityId: EntityId,
    ...componentClasses: ComponentClass<any>[]
  ): Component[] => {
    const components: Component[] = [];
    const callback = (componentClass: ComponentClass<any>) => {
      components.push(this.getComponentById(entityId, componentClass));
    };
    componentClasses.forEach(callback);
    return components;
  };

  getAllComponentsOfId = (entityId: EntityId) => {
    let components: Component[] = [];
    Object.values(this._componentLists).forEach(componentList => {
      const component = componentList.get(entityId);
      if (component) components.push(component);
    });
    return components;
  };

  // createEntity = (): Entity => {
  //   return new Entity(this.newEntityId(), this);

  //   // TODO: every single entity have PositionComponent and TagComponent by default ????
  //   // entity.addComponent(new PositionComponent(...))
  //   // entity.addComponent(new TagComponent(...))
  //   // return entity;
  // };

  newEntityId = (): EntityId => this.entityIdPool.getId();

  newEntityIdWithAlias = (aliasId: EntityId): EntityId | null => {
    const entityId = this.newEntityId();
    if (isNumber(this.addEntityIdAlias(entityId, aliasId))) return entityId;

    this.entityIdPool.reclaimId(entityId);
    return null;
  };

  addEntityIdAlias = (entityId: EntityId, aliasId: EntityId): EntityId | null => {
    const addedAliasId = this._entityIdAliases.add(new EntityIdAlias(aliasId, entityId));
    return addedAliasId ? addedAliasId.id : null;
  };

  getEntityIdByAlias = (aliasId: EntityId) => {
    return (<EntityIdAlias>this._entityIdAliases.get(aliasId))?.entityId;
  };

  getOrCreateEntityIdByAlias = (aliasId: EntityId): EntityId => {
    const entityId = this.getEntityIdByAlias(aliasId);
    return isNumber(entityId) ? entityId : this.newEntityIdWithAlias(aliasId);
  };

  getOrCreateNullComponentById = <T extends Component>(
    entityId: EntityId,
    componentClass: ComponentClass<T>
  ): T => {
    let component = this.getComponentById(entityId, componentClass);
    return component ? component : Component.createNull(entityId, componentClass);
  };

  getOrAddNullComponentById = <T extends Component>(
    entityId: EntityId,
    componentClass: ComponentClass<T>
  ): T => {
    return this.addComponent(this.getOrCreateNullComponentById(entityId, componentClass));
  };

  removeEntity = (entityId: EntityId) => {
    // NOTE: In EnTT this happens by iterating every single sparse set in the registry, checking if it contains the entity, and deleting it if it does.
    Object.values(this._componentLists).forEach(componentList => componentList.remove(entityId));
    this.entityIdPool.reclaimId(entityId);
  };

  // NOTE: fast O(1) bulk operations
  removeAllComponents = () => {
    Object.values(this._componentLists).forEach(componentList => componentList.clear());
    this.entityIdPool.clear();
  };

  update = (deltaTime: DeltaTime) => {
    this._deltaTime = deltaTime;
    // TODO: cycle through the systems, in priority
    this._updating = true;
    // this._systemUpdateFunctions.forEach(this.callSystemUpdateFunction);
    this._systems.forEach(this.updateSystem);
    this._updating = false;
    // this.updateComplete.dispatch(); // TODO: signals??
  };

  query = (callback: QueryCallback, ...componentClasses: ComponentClass<any>[]) => {
    if (componentClasses.length === 0) throw Error("Empty Query");

    // NOTE: finding shortest component list
    let shortestComponentListIndex = 0;

    let shortestComponentList =
      this._componentLists[componentClasses[shortestComponentListIndex].name];

    if (!shortestComponentList) return;

    componentClasses.forEach((componentClass, index) => {
      const nextShortestComponentList = this._componentLists[componentClass.name];

      if (nextShortestComponentList && shortestComponentList) {
        if (nextShortestComponentList.size < shortestComponentList.size) {
          shortestComponentList = nextShortestComponentList;
          shortestComponentListIndex = index;
        }
      }
    });

    // NOTE: cycling through the shortest component list

    // NOTE: pre-made function to avoid creating new one on each iteration
    // NOTE: defined once per query to enclose the variables in the rest of this function, otherwise
    // it could be defined outside. But still, defining function once per query [O(1)] is much
    // better than defining it once per iteration [O(n)]
    const processComponent = component => {
      const entityId = component.id;

      // TODO: optimize by caching querySet array ??
      const querySet: QuerySet = [];

      const componentClassesLength = componentClasses.length;
      for (let i = 0; i < componentClassesLength; i++) {
        const componentClassName = componentClasses[i].name;
        const anotherComponent = this._componentLists[componentClassName]?.get(entityId);

        if (anotherComponent) querySet.push(anotherComponent as Component);
        else break; // NOTE: soon as we discover a missing component, abandon further pointless search for that entityId !

        if (i + 1 === componentClassesLength) callback(querySet);
      }
    };

    shortestComponentList.stream(processComponent);
  };

  get deltaTime() {
    return this._deltaTime;
  }

  private updateSystem = (system: System) => system.update();

  private reclaimEntityIdIfFree = (entityId: EntityId) => {
    if (this.getAllComponentsOfId(entityId).length === 0) {
      this.entityIdPool.reclaimId(entityId);
      // entity.reload();
    }
  };
}

export default Engine;
