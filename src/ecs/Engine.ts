import {
  ComponentClass,
  DeltaTime,
  EntityId,
  EntityIdPoolParams,
  QueryCallback,
  QuerySet,
} from "./types";
import EntityIdPool from "./engine/EntityIdPool";
import Component from "./Component";
import SparseSet from "./utils/SparseSet";
import System from "./System";
import { isNumber } from "./utils/Number";

// TODO: jest tests !!!!
class Engine {
  _deltaTime: DeltaTime;
  _updating: boolean;
  // updateComplete: any; // TODO: better type?
  // NOTE: for faster iteration, reference straight to update function, one indirection instead of 2
  // (-> system -> update)
  // _systemUpdateFunctions: ((engine: Engine, deltaTime: DeltaTime) => void)[];
  _systems: System[]; // NOTE: handle onn system to call start() and destroy()
  _componentLists: { [key: string]: SparseSet };
  _entityIdPool: EntityIdPool;
  private _debug: boolean | undefined;

  constructor(debug?: boolean) {
    this._debug = debug;
    // this._systemUpdateFunctions = [];
    this._systems = [];
    this._deltaTime = 0;
    this._updating = false;
    this._componentLists = {};
    // this.updateComplete = new signals.Signal(); // TODO: signals?? https://github.com/millermedeiros/js-signals
    this._entityIdPool = new EntityIdPool();
  }

  // TODO: jests
  importEntityIdPool = (params: EntityIdPoolParams) => {
    this._entityIdPool.import(params);
  };

  // TODO: jests
  exportEntityIdPool = () => this._entityIdPool.export();

  addSystem = (system: System) => {
    // addSystem = (system: System, priority?: number) => {
    // TODO: priority integer sorting
    // simple priority based on insertion order for now...
    // this._systemUpdateFunctions.push(system.update);
    this._systems.push(system);
    system.start();

    if (this._debug) console.log(`[Engine]: Started system: ${system.constructor.name}`);
  };

  // getSystem

  // removeSystem
  // () => { ... system.destroy()}

  // removeAllSystems

  addComponent = (component: Component) => {
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

  removeComponent = (component: Component) => {
    // NOTE: indexing using component class name
    const componentClassName = component.constructor.name;
    const componentList = this._componentLists[componentClassName];
    if (!componentList) return;

    const oldEntityId = component.id;
    componentList.remove(component);
    if (isNumber(oldEntityId)) this.reclaimEntityIdIfFree(oldEntityId);
  };

  // TODO: testing !!!
  removeComponents = (components: Component[]) => {
    components.forEach((component: Component) => this.removeComponent(component));
  };

  removeComponentById = (componentClass: ComponentClass, entityId: EntityId) => {
    const componentList = this._componentLists[componentClass.name];
    if (!componentList) return;

    componentList.remove(entityId);
    if (isNumber(entityId)) this.reclaimEntityIdIfFree(entityId);
  };

  getComponent = <T>(componentClass: ComponentClass, entityId: EntityId) => {
    return this._componentLists[componentClass.name]?.get(entityId) as T | null;
  };

  getComponents = (entityId: EntityId) => {
    return Object.values(this._componentLists)
      .map(componentList => componentList.get(entityId))
      .filter(component => component) as Component[];
  };

  // createEntity = (): Entity => {
  //   return new Entity(this.generateEntityId(), this);

  //   // TODO: every single entity have PositionComponent and TagComponent by default ????
  //   // entity.addComponent(new PositionComponent(...))
  //   // entity.addComponent(new TagComponent(...))
  //   // return entity;
  // };

  generateEntityId = (): EntityId => this._entityIdPool.getId();

  removeEntity = (entityId: EntityId) => {
    // NOTE: In EnTT this happens by iterating every single sparse set in the registry, checking if it contains the entity, and deleting it if it does.
    Object.values(this._componentLists).forEach(componentList => componentList.remove(entityId));

    this._entityIdPool.reclaimId(entityId);
  };

  // NOTE: fast O(1) bulk operations
  removeAllEntities = () => {
    Object.values(this._componentLists).forEach(componentList => componentList.clear());

    this._entityIdPool.clear();
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

  query = (callback: QueryCallback, ...componentClasses: ComponentClass[]) => {
    if (componentClasses.length === 0) throw Error("Empty Query");

    // NOTE: finding shortest component list
    let shortestComponentListIndex = 0;

    let shortestComponentList = this._componentLists[
      componentClasses[shortestComponentListIndex].name
    ];

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
    const componentsIterator = shortestComponentList.streamIterator();

    for (const component of componentsIterator) {
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
    }
  };

  get deltaTime() {
    return this._deltaTime;
  }

  private updateSystem = (system: System) => system.update();

  private reclaimEntityIdIfFree = (entityId: EntityId) => {
    if (this.getComponents(entityId).length === 0) this._entityIdPool.reclaimId(entityId);
  };
}

export default Engine;
