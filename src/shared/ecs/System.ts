import Engine from "./Engine";

// TODO: jest tests !!!!
abstract class System {
  private readonly _engine: Engine;

  constructor(engine: Engine) {
    this._engine = engine;
  }

  // TODO: init stuff, engine should run this when system right after system is added
  abstract start(): void;

  // NOTE: called once per tick. DeltaTime can be extracted from the engine reference
  abstract update(): void;

  // TODO: clean up before system shutdown, engine should call this before removing system
  abstract destroy(): void;

  get engine() {
    return this._engine;
  }

  get deltaTime() {
    return this.engine.deltaTime;
  }
}

export default System;
