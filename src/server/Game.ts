import { Engine } from "../shared/ecs/index";
import { DeltaTime } from "../shared/ecs/types";
import TickProvider from "../shared/ecs/utils/TickProvider";
import { DEVELOPMENT } from "../shared/utils/environment";
import Manager from "./systems/Manager";
import uWS from "uWebSockets.js";
import ConnectionListener from "./systems/ConnectionListener";
// import FpsCounter from "./utils/FpsCounter";
import WebSocketInitializer from "./systems/WebSocketInitializer";
import MessageListener from "./systems/MessageListener";
import DisconnectionListener from "./systems/DisconnectionListener";
import MessageDeserializer from "../shared/systems/MessageDeserializer";
import CharacterDeserializer from "./systems/CharacterDeserializer";
import MovementControl from "./systems/MovementControl";
import Movement from "./systems/Movement";
import State from "./game/State";
import SpatialPartitioning from "./systems/SpatialPartitioning";
import CharacterConnected from "./systems/CharacterConnected";
import CharacterMove from "./systems/CharacterMove";
import Broadcast from "./systems/Broadcast";

class Game {
  lastDeltaTime: any;
  lastFrame: any;
  private _engine!: Engine;
  private _server: uWS.TemplatedApp;
  private _state: State;

  constructor(server: uWS.TemplatedApp) {
    this._server = server;
    this._state = new State();
    this._state.load();
    this.initECS();
  }

  run = () => {
    const tickProvider = new TickProvider(this.updateEngine);
    tickProvider.start();
  };

  private initECS = () => {
    this._engine = new Engine(DEVELOPMENT);
    // TODO: test all systems.
    this._engine.addSystem(new Manager(this._engine));
    this._engine.addSystem(new WebSocketInitializer(this._engine, this._server));
    this._engine.addSystem(new ConnectionListener(this._engine));
    this._engine.addSystem(new MessageListener(this._engine));
    this._engine.addSystem(new MessageDeserializer(this._engine));
    this._engine.addSystem(new DisconnectionListener(this._engine));
    this._engine.addSystem(new CharacterDeserializer(this._engine));
    this._engine.addSystem(new MovementControl(this._engine));
    this._engine.addSystem(new Movement(this._engine));
    // this._engine.addSystem(new Collision(this._engine)); // TODO: takes in transform and checks it against map. Might be useful to store 'previous' values on Transform (that get auto updated) so in case of collision Transform could be reverted to that?
    this._engine.addSystem(new SpatialPartitioning(this._engine, this._state));
    this._engine.addSystem(new CharacterConnected(this._engine, this._state));
    this._engine.addSystem(new CharacterMove(this._engine));
    // TODO: any other systems here
    // this._engine.addSystem(new Serializer(this._engine)); # gonna invoke sidekiq workers
    // this._engine.addSystem(new AI(this._engine));
    // this._engine.addSystem(new Script(this._engine)); // scripts ?
    this._engine.addSystem(new Broadcast(this._engine)); // NOTE: always last
  };

  private updateEngine = (deltaTime: DeltaTime) => this._engine.update(deltaTime);
}

export default Game;
