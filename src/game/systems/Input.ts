import { Scene } from "phaser";
import { Engine } from "../../ecs";
import System from "../../ecs/System";
import { InputEventType, InputObject, QuerySet } from "../../ecs/types";
import InputEvent from "../components/InputEvent";

const DEFAULT_INPUTS = [
  { type: InputEventType.KEYDOWN, key: "UP" },
  { type: InputEventType.KEYDOWN, key: "DOWN" },
  { type: InputEventType.KEYDOWN, key: "LEFT" },
  { type: InputEventType.KEYDOWN, key: "RIGHT" },
  { type: InputEventType.KEYDOWN, key: "A" },
  { type: InputEventType.KEYDOWN, key: "W" },
  { type: InputEventType.KEYDOWN, key: "S" },
  { type: InputEventType.KEYDOWN, key: "D" },

  { type: InputEventType.KEYUP, key: "UP" },
  { type: InputEventType.KEYUP, key: "DOWN" },
  { type: InputEventType.KEYUP, key: "LEFT" },
  { type: InputEventType.KEYUP, key: "RIGHT" },
  { type: InputEventType.KEYUP, key: "A" },
  { type: InputEventType.KEYUP, key: "W" },
  { type: InputEventType.KEYUP, key: "S" },
  { type: InputEventType.KEYUP, key: "D" },
];

class Input extends System {
  private _scene: Scene;
  private _inputs: InputObject[];
  private _inputEventObjectBuffer: InputObject[];

  constructor(engine: Engine, scene: Scene, inputs?: InputObject[] | undefined) {
    super(engine);
    this._scene = scene;
    this._inputs = inputs || DEFAULT_INPUTS;
    this._inputEventObjectBuffer = [];
  }

  start(): void {
    // async collect input events into buffer
    this._inputs.forEach(this.registerInputCallback);
  }

  update(): void {
    this.engine.query(this.cleanUpEvents, InputEvent);
    // sync flush input event buffer and create a sequence of input events
    this.createInputEventEntities();
  }

  destroy(): void {}

  private registerInputCallback = ({ type, key }: InputObject) => {
    this._scene.input.keyboard.on(`${type}-${key}`, (e: any) => {
      this._inputEventObjectBuffer.push({ type, key });
    });
  };

  // any input events that have travelled full circle and weren't removed by any system are removed
  private cleanUpEvents = (querySet: QuerySet) => {
    const [inputEvent] = querySet as [InputEvent];

    // NOTE: for the moment, this is non-leaky as removeEntity will reclaim the entityId. This is
    // good as input events will occur and disappear all the time...
    this.engine.removeEntity(inputEvent.id);
  };

  private createInputEventEntities = () => {
    // TODO: need to swap the buffer here. Probably build a buffer abstraction class.
    // Swapping buffers allows you to process old messages while still allowing new messages to come
    // in - they can comme in any time remember!
    // Otherwise with single buffer only, message can come in mid iteration and be lost if iterator
    // is past that point !!!

    this._inputEventObjectBuffer.forEach(({ type, key }) => {
      const entityId = this.engine.generateEntityId();
      const inputEvent = new InputEvent(entityId);
      inputEvent.type = type;
      inputEvent.key = key;
      this.engine.addComponent(inputEvent);
    });

    this._inputEventObjectBuffer = [];
  };
}

export default Input;
