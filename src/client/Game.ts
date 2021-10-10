import { Engine } from "../shared/ecs";
import { DeltaTime } from "../shared/ecs/types";
import TickProvider from "../shared/ecs/utils/TickProvider";
import MessageDeserializer from "../shared/systems/MessageDeserializer";
import { DEVELOPMENT } from "../shared/utils/environment";
import ConnectionListener from "./systems/ConnectionListener";
import DisconnectionListener from "./systems/DisconnectionListener";
import Manager from "./systems/Manager";
import MessageListener from "./systems/MessageListener";
// import FpsCounter from "./utils/FpsCounter";

class Game {
  // dudeQuads!: any[];
  lastDeltaTime: any;
  lastFrame: any;
  // fpsCounter!: FpsCounter;
  private _engine!: Engine;
  private _webSocket: WebSocket;

  constructor() {
    this.initECS();
    this._webSocket = new WebSocket(this.webSocketURL());
    this._webSocket.binaryType = "arraybuffer"; // TODO: move this to MessageListener init?
  }

  run = () => {
    const tickProvider = new TickProvider(this.updateEngine);
    tickProvider.start();
  };

  private initECS = () => {
    this._engine = new Engine(DEVELOPMENT);
    // TODO: test all systems.
    this._engine.addSystem(new Manager(this._engine));
    this._engine.addSystem(new ConnectionListener(this._engine, this._webSocket));
    this._engine.addSystem(new MessageListener(this._engine, this._webSocket));
    this._engine.addSystem(new MessageDeserializer(this._engine));
    this._engine.addSystem(new DisconnectionListener(this._engine, this._webSocket));

    // this._engine.addSystem(new Serialization(this._engine, this));
    // if (DEVELOPMENT) this._engine.addSystem(new SceneEditor(this._engine));
    // // this._engine.addSystem(new Network(this._engine, this)); // TODO: networking here ...
    // this._engine.addSystem(new Input(this._engine, this));
    // this._engine.addSystem(new Interaction(this._engine, this));
    // this._engine.addSystem(new MovementControl(this._engine));
    // // this._engine.addSystem(new AI(this._engine));
    // // physics
    // this._engine.addSystem(new Dragging(this._engine));
    // this._engine.addSystem(new Movement(this._engine));
    // // this._engine.addSystem(new Animation(this._engine)); // will hook into state of the entity (animation state machine)
    // // this._engine.addSystem(new Collision(this._engine));
    // this._engine.addSystem(new Render(this._engine, this)); // shadows will be handled under sprite? or should it be separate system...?
    // // analysis -> print how long each system is taking / where is the bottleneck?

    // // TODO: move to camera component / render component
    // this.cameras.main.setBackgroundColor(0xffffff);

    // // TODO: move to some system 'Debug' system?
    // this.fpsCounter = new FpsCounter();
  };

  private updateEngine = (deltaTime: DeltaTime) => this._engine.update(deltaTime);

  private webSocketURL = () => window.location.origin.replace("http", "ws");
}

export default Game;
