import { Engine } from "../../shared/ecs";
import System from "../../shared/ecs/System";
import { EntityId, QuerySet } from "../../shared/ecs/types";
import LoadSprite from "../components/LoadSprite";
import Buffer from "../../shared/utils/Buffer";

type LoadEvent = {
  key: string;
  type: string;
  texture: Phaser.Textures.Texture;
  entityId: EntityId;
};

class SpriteLoader extends System {
  private _scene: Phaser.Scene;
  private _loadEventsBuffer: Buffer<LoadEvent>;

  constructor(engine: Engine, scene: Phaser.Scene) {
    super(engine);
    this._scene = scene;
    this._loadEventsBuffer = new Buffer<LoadEvent>();
  }

  start(): void {}

  update(): void {
    this.engine.query(this.queueLoadEvents, LoadSprite);
    // this.engine.removeComponentsOfClass(LoadSprite);
    // start loading (can call this over and over, even when already loading...no harm)
    this._scene.load.start();
    // this.createSprite;
  }

  destroy(): void {}

  private queueLoadEvents = (querySet: QuerySet) => {
    const [loadSprite] = querySet as [LoadSprite];

    const key = "bot";
    // TODO: check if loaded already and if so avoid loading again
    this.isTextureLoading(key); // TODO: wip...

    const pendingLoad = this._scene.load.spritesheet({
      key,
      url: "images/robot.png",
      frameConfig: {
        frameWidth: 32,
        frameHeight: 38,
        startFrame: 0,
        endFrame: 8,
      },
    });
    pendingLoad.on(
      "filecomplete",
      (key, type, texture) => this.addLoadEvent(key, type, texture, loadSprite.id),
      this._scene
    );

    //
    // const entityId = this.engine.generateEntityIdWithAlias(characterId);
    // const characterComponents = [
    //   new Character(entityId),
    //   new Name(entityId, characterName),
    //   new HitPoints(entityId, hitpoints),
    //   new Transform(entityId, { x, y, z }),
    // ];
    // this.engine.addComponents(...characterComponents);
  };

  private isTextureLoading = (textureUrl: string): boolean => {
    return this._scene.textures.get(textureUrl).key === "__MISSING";
  };

  private addLoadEvent = (
    key: string,
    type: string,
    texture: Phaser.Textures.Texture,
    entityId: EntityId
  ) => {
    this._loadEventsBuffer.push({ key, type, texture, entityId });
  };
}

export default SpriteLoader;

// function addImage (key, type, thing)
// {
//     console.log(key);
//     console.log(type);
//     console.log(thing);
//     this.add.image(400, 300, key);
// }
