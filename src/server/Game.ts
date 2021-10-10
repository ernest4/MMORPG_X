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

class Game {
  // dudeQuads!: any[];
  lastDeltaTime: any;
  lastFrame: any;
  // fpsCounter!: FpsCounter;
  private _engine!: Engine;
  private _server: uWS.TemplatedApp;

  constructor(server: uWS.TemplatedApp) {
    this._server = server;
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

    this._engine.addSystem(new Movement(this._engine)); // TODO: ...

    // @engine.add_system(Pulse::Ecs::Systems::Collision.new) # TODO: takes in transform and checks it against map. Might be useful to store 'previous' values on Transform (that get auto updated) so in case of collision Transform could be reverted to that?
    // @engine.add_system(Pulse::Ecs::Systems::SpatialPartitioning.new(@state))
    // @engine.add_system(Pulse::Ecs::Systems::CharacterEnter.new(@state))
    // @engine.add_system(Pulse::Ecs::Systems::CharacterMove.new)
    // # TODO: any other systems here
    // # @engine.add_system(Pulse::Ecs::Systems::Serializer.new) # gonna invoke sidekiq workers
    // # @engine.add_system(AI.new)
    // @engine.add_system(Pulse::Ecs::Systems::Broadcast.new) # NOTE: always last
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
}

export default Game;
