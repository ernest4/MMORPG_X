import { Scene } from "phaser";
import { Engine } from "../../ecs";
import System from "../../ecs/System";
import { QuerySet } from "../../ecs/types";
import SerializeEvent from "../components/SerializeEvent";
import Transform from "../components/Transform";
import * as availableComponents from "../components";
import Vector3BufferView from "../../ecs/utils/Vector3BufferView";

const MAX_SCENE_JSON_STRING_SIZE = 268435440; // NOTE: this is hard limit from chrome v8

class Serialization extends System {
  private _scene: Scene;
  private _state: any;
  private _serialize!: boolean;
  private _sceneHashBuffer: {};
  private _currentSceneJsonStringSize: number;

  constructor(engine: Engine, scene: Scene) {
    super(engine);
    this._scene = scene;
    this._sceneHashBuffer = {};
    this._currentSceneJsonStringSize = 0;
  }

  start(): void {
    this._state = this._scene.cache.json.get("state_scenes_main");
    this._currentSceneJsonStringSize = JSON.stringify(this._state).length; // TODO: not efficient to stringify entire scene again... probably need to cache this on the scene file??
    this.loadStateIntoEngine();
  }

  update(): void {
    this.engine.query(this.handleSerializeEvents, SerializeEvent);

    if (this._serialize) {
      this.prepareSceneHashBuffer();
      this.engine.query(this.serializeEntities, Transform); // NOTE: any entity with Transform only
      this._serialize = false; // NOTE: resetting the flag
      this.flushSceneHashBuffer();
    }
  }

  destroy(): void {}

  private loadStateIntoEngine = () => {
    // TODO: ...
    console.log(this._state); // TESTING

    this.engine.importEntityIdPool(this._state.entityIdPool);

    this.loadComponents();
  };

  // TODO: test by simple engine look up & print to console....
  private loadComponents = () => {
    this._state.components.forEach(({ entityId, name, properties }: any) => {
      // TODO: types ???
      const componentClass = (availableComponents as any)[name];
      const component = new componentClass(entityId);

      Object.entries(properties).forEach(([property, value]: [string, any]) => {
        if (property.indexOf(".") === -1) return ((component as any)[property] = value);

        const [propertyVector, propertyVectorAxis] = property.split(".");
        (component as any)[propertyVector][propertyVectorAxis] = value;
      });

      this.engine.addComponent(component);
    });
  };

  private handleSerializeEvents = (querySet: QuerySet) => {
    const [serializeEvent] = querySet as [SerializeEvent];

    this.engine.removeEntity(serializeEvent.id);

    // NOTE: set flag to serialize once per N serializeEvents to prevent spam
    this._serialize = true;
  };

  private prepareSceneHashBuffer = () => {
    this._sceneHashBuffer = {
      name: "main",
      entityIdPool: this.engine.exportEntityIdPool(),
      components: [],
    };
  };

  private serializeEntities = (querySet: QuerySet) => {
    const [transform] = querySet as [Transform];

    // NOTE: serialize https://web.dev/file-system-access/#read-a-file-from-the-file-system

    const components = this.engine.getComponents(transform.id);
    const permittedComponents = components.filter(({ serializable }) => serializable);

    permittedComponents.forEach(async component => {
      const componentHash = {
        entityId: component.id,
        name: component.constructor.name,
        properties: {},
      };

      Object.entries(component).forEach(([property, value]) => {
        if (property === "_id") return;
        if (property === "_values") return;
        if (property === "loaded") return;
        if (property === "processed") return;
        if (property === "_serializable") return;

        property = this.normalizePropertyName(property);

        if (value.constructor.name === "Vector3BufferView") {
          return this.vectorSerialize({ property, value, properties: componentHash.properties });
        }

        if (typeof value === "boolean") {
          return this.booleanSerialize({ property, value, properties: componentHash.properties });
        }

        if (typeof value === "string") {
          return this.stringSerialize({ property, value, properties: componentHash.properties });
        }

        if (!isNaN(value)) {
          return this.numberSerialize({ property, value, properties: componentHash.properties });
        }

        // return JSON.stringify(value); // unknown / ref / catch all
      });

      // console.log(componentHash); // TESTING

      (this._sceneHashBuffer as any)["components"].push(componentHash);
    });
  };

  private flushSceneHashBuffer = () => {
    this.saveSceneToFile(this._sceneHashBuffer);
    this._sceneHashBuffer = {};
  };

  private saveSceneToFile = async (data: any) => {
    const fileHandle = await this.getFileHandle();
    const currentSceneJsonString = JSON.stringify(data);
    this._currentSceneJsonStringSize = currentSceneJsonString.length;
    // TODO: display this in the editor
    // console.log(this._currentSceneJsonStringSize); // TESTING
    // console.log((this._currentSceneJsonStringSize / MAX_SCENE_JSON_STRING_SIZE) * 100); // TESTING
    alert(`
      current Scene Json String Size: ${this._currentSceneJsonStringSize}
      current Scene Json String Size Percent: ${
        (this._currentSceneJsonStringSize / MAX_SCENE_JSON_STRING_SIZE) * 100
      }
    `);
    this.writeFile(fileHandle, currentSceneJsonString);
  };

  private getFileHandle = async () => {
    const options = { types: [{ description: "JSON scene state file" }] };

    // @ts-ignore
    return await window.showSaveFilePicker(options);
  };

  private writeFile = async (fileHandle: any, contents: any) => {
    // Create a FileSystemWritableFileStream to write to.
    const writable = await fileHandle.createWritable();
    // Write the contents of the file to the stream.
    await writable.write(contents);
    // Close the file and write the contents to disk.
    await writable.close();
  };

  private normalizePropertyName = (property: string) => property.replace(/^_/, "");

  private vectorSerialize = ({
    property,
    value,
    properties,
  }: {
    property: string;
    value: Vector3BufferView;
    properties: any;
  }) => {
    properties[`${property}.x`] = value.x;
    properties[`${property}.y`] = value.y;
    properties[`${property}.z`] = value.z;
  };

  private booleanSerialize = ({
    property,
    value,
    properties,
  }: {
    property: string;
    value: boolean;
    properties: any;
  }) => {
    properties[property] = value;
  };

  private stringSerialize = ({
    property,
    value,
    properties,
  }: {
    property: string;
    value: string;
    properties: any;
  }) => {
    properties[property] = value;
  };

  private numberSerialize = ({
    property,
    value,
    properties,
  }: {
    property: string;
    value: number;
    properties: any;
  }) => {
    properties[property] = value;
  };
}

export default Serialization;
