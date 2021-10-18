import { Engine } from "../../shared/ecs";
import System from "../../shared/ecs/System";
import { EntityId, QuerySet } from "../../shared/ecs/types";
import LoadSpriteEvent from "../components/LoadSprite";
import Buffer from "../../shared/utils/Buffer";
import { Sprite } from "../components";

type LoadEvent = {
  key: string;
  type: string;
  texture: Phaser.Textures.Texture;
  targetEntityId: EntityId;
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
    this.engine.query(this.queueLoadEvents, LoadSpriteEvent);
    this.engine.removeComponentsOfClass(LoadSpriteEvent);
    // start loading (can call this over and over, even when already loading...no harm)
    this._scene.load.start();
    this.createSpriteComponents();
  }

  destroy(): void {}

  private queueLoadEvents = (querySet: QuerySet) => {
    const [{ url, frameConfig, targetEntityId }] = querySet as [LoadSpriteEvent];

    // TODO: check if loaded already and if so avoid loading again
    // this.isTextureLoading(key); // TODO: wip...

    const pendingLoad = this._scene.load.spritesheet({ key: url, url, frameConfig });
    pendingLoad.on(
      "filecomplete",
      (key, type, texture) => this.addLoadEvent(key, type, texture, targetEntityId),
      this._scene
    );
  };

  private createSpriteComponents = () => {
    this._loadEventsBuffer.process(({ key, type, texture, targetEntityId }) => {
      const phaserSprite = this._scene.add.sprite(0, 0, key);
      const sprite = new Sprite(targetEntityId, phaserSprite);
      this.engine.addComponent(sprite);
    });
  };

  // Not sure if this works as intended: https://photonstorm.github.io/phaser3-docs/Phaser.Textures.TextureManager.html
  // private isTextureLoading = (textureUrl: string): boolean => {
  //   return this._scene.textures.get(textureUrl).key === "__MISSING";
  // };

  private addLoadEvent = (
    key: string,
    type: string,
    texture: Phaser.Textures.Texture,
    targetEntityId: EntityId
  ) => {
    this._loadEventsBuffer.push({ key, type, texture, targetEntityId });
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
