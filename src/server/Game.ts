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
import CharacterConnectedPublisher from "./systems/CharacterConnectedPublisher";
import Broadcaster from "./systems/Broadcaster";
// import TransformChanged from "./systems/TransformChanged";
import NetworkedComponentNearbyPublisher from "./systems/NetworkedComponentNearbyPublisher";
import { MoveMessage } from "../shared/messages/schema";
import Transform from "../shared/components/Transform";
import NearbyCharacterConnectedEvent from "./components/NearbyCharacterConnectedEvent";
import ConnectionEvent from "../shared/components/ConnectionEvent";
import Character from "../shared/components/Character";
import Name from "../shared/components/Name";
import Drifter from "../shared/components/characterTypes/Drfiter";
import HitPoints from "../shared/components/HitPoints";

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
    this._engine.addSystems(
      new Manager(this._engine),
      new WebSocketInitializer(this._engine, this._server),
      new ConnectionListener(this._engine),
      new MessageListener(this._engine),
      new MessageDeserializer(this._engine),
      new DisconnectionListener(this._engine),
      new CharacterDeserializer(this._engine),
      new MovementControl(this._engine),
      new Movement(this._engine),
      // new Collision(this._engine), // TODO: takes in transform and checks it against map. Might be useful to store 'previous' values on Transform (that get auto updated) so in case of collision Transform could be reverted to that?
      new SpatialPartitioning(this._engine, this._state),

      new CharacterConnectedPublisher(this._engine, this._state),

      new NetworkedComponentNearbyPublisher(this._engine, Character, [
        ConnectionEvent,
        NearbyCharacterConnectedEvent,
      ]),
      new NetworkedComponentNearbyPublisher(this._engine, Name, [
        ConnectionEvent,
        NearbyCharacterConnectedEvent,
      ]),
      new NetworkedComponentNearbyPublisher(this._engine, Drifter, [
        ConnectionEvent,
        NearbyCharacterConnectedEvent,
      ]),
      new NetworkedComponentNearbyPublisher(this._engine, HitPoints, [
        ConnectionEvent,
        NearbyCharacterConnectedEvent,
      ]),
      new NetworkedComponentNearbyPublisher(this._engine, Transform, [
        MoveMessage,
        ConnectionEvent,
        NearbyCharacterConnectedEvent,
      ]),

      // TODO: any other systems here
      // new Serializer(this._engine), # gonna invoke sidekiq workers
      // new AI(this._engine),
      // new Script(this._engine), // scripts ?
      new Broadcaster(this._engine) // NOTE: always last
    );
  };

  private updateEngine = (deltaTime: DeltaTime) => this._engine.update(deltaTime);
}

export default Game;
