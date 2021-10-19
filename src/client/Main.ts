import { Engine } from "../shared/ecs";
import { DeltaTime } from "../shared/ecs/types";
import MessageDeserializer from "../shared/systems/MessageDeserializer";
import { DEVELOPMENT } from "../shared/utils/environment";
import ConnectionListener from "./systems/ConnectionListener";
import DisconnectionListener from "./systems/DisconnectionListener";
import InputListener from "./systems/InputListener";
import Manager from "./systems/Manager";
import MessageListener from "./systems/MessageListener";
import SpriteRender from "./systems/SpriteRender";
import Broadcaster from "./systems/Broadcaster";
import MovementControlPublisher from "./systems/MovementControlPublisher";
import SpriteLoader from "./systems/SpriteLoader";
import NetworkedComponentsSynchronizer from "./systems/NetworkedComponentsSynchronizer";
import {
  CharacterMessage,
  DrifterMessage,
  HitPointsMessage,
  HunterMessage,
  MESSAGE_TYPE,
  NameMessage,
  TransformMessage,
} from "../shared/messages/schema";
import Transform from "../shared/components/Transform";
import HitPoints from "../shared/components/HitPoints";
import Character from "../shared/components/Character";
import Drifter from "../shared/components/characterTypes/Drfiter";
import Name from "../shared/components/Name";
import DrifterMessageToSpriteLoadEvent from "./systems/DrifterMessageToSpriteLoadEvent";
import Phaser from "phaser";
// import FpsCounter from "./utils/FpsCounter";

export default class Main extends Phaser.Scene {
  // dudeQuads!: any[];
  lastDeltaTime: any;
  lastFrame: any;
  // fpsCounter!: FpsCounter;
  private _engine!: Engine;
  private _webSocket: WebSocket;

  constructor(config) {
    super(config);
  }

  // init(data) {}
  // preload() {}

  create(data) {
    this._webSocket = new WebSocket(this.webSocketURL());
    this._webSocket.binaryType = "arraybuffer"; // TODO: move this to MessageListener init?
    this.initECS();
  }

  update(time, delta) {
    this.updateEngine(delta);
  }

  private initECS = () => {
    this._engine = new Engine(DEVELOPMENT);
    // TODO: test all systems.
    this._engine.addSystems(
      new Manager(this._engine),
      new ConnectionListener(this._engine, this._webSocket),
      new MessageListener(this._engine, this._webSocket),
      new MessageDeserializer(this._engine),
      new DisconnectionListener(this._engine, this._webSocket),
      new InputListener(this._engine, this),

      new MovementControlPublisher(this._engine),

      new NetworkedComponentsSynchronizer<MESSAGE_TYPE.CHARACTER>(
        this._engine,
        Character,
        CharacterMessage
      ),
      new NetworkedComponentsSynchronizer<MESSAGE_TYPE.NAME>(this._engine, Name, NameMessage),
      new NetworkedComponentsSynchronizer<MESSAGE_TYPE.TRANSFORM>(
        this._engine,
        Transform,
        TransformMessage
      ),
      new NetworkedComponentsSynchronizer<MESSAGE_TYPE.HITPOINTS>(
        this._engine,
        HitPoints,
        HitPointsMessage
      ),

      // CharacterTypes ==>
      new NetworkedComponentsSynchronizer<MESSAGE_TYPE.DRIFTER>(
        this._engine,
        Drifter,
        DrifterMessage
      ),
      // NOTE: need to explicit template type like above or get bugs like this below...
      // new NetComponentsSyncer(this._engine, Drifter, CharacterMessage)); // BUGGY!!!
      // new NetComponentsSyncer(this._engine, Hunter, HunterMessage));
      // new ApplyParsedMessages(this._engine, Hacker, HackerMessage));
      // <== CharacterTypes
      // ... REST ...

      // TODO: something needs to pull in the room data and trigger loading assets for that
      // new RoomSynchronizer(this._engine), // TODO: split into room init + update systems ?
      // TODO: something needs to trigger character sprite to load, Hunter component for now?
      new DrifterMessageToSpriteLoadEvent(this._engine),
      // NEED TO PRODUCE LoadSpriteEvent !

      // new AssetLoader(this._engine), // TODO: async load in sprites / textures /sounds etc
      new SpriteLoader(this._engine, this), // TODO: refactor into asset loader?
      new SpriteRender(this._engine),
      new Broadcaster(this._engine, this._webSocket) // NOTE: always last
    );

    // new Serialization(this._engine, this));
    // if (DEVELOPMENT) new SceneEditor(this._engine),
    // // new Network(this._engine, this)); // TODO: networking here ...
    // new Input(this._engine, this));
    // new Interaction(this._engine, this));
    // new MovementControl(this._engine),
    // // new AI(this._engine),
    // // physics
    // new Dragging(this._engine),
    // new Movement(this._engine),
    // // new Animation(this._engine), // will hook into state of the entity (animation state machine)
    // // new Collision(this._engine),
    // new Render(this._engine, this)); // shadows will be handled under sprite? or should it be separate system...?
    // // analysis -> print how long each system is taking / where is the bottleneck?

    // // TODO: move to camera component / render component
    // this.cameras.main.setBackgroundColor(0xffffff);

    // // TODO: move to some system 'Debug' system?
    // this.fpsCounter = new FpsCounter();
  };

  private updateEngine = (deltaTime: DeltaTime) => this._engine.update(deltaTime);

  private webSocketURL = (): string => {
    let wsEndpoint = window.location.origin.replace("http", "ws");
    if (wsEndpoint.includes("localhost")) wsEndpoint = wsEndpoint.replace("8085", "3001");
    return wsEndpoint;
  };
}
