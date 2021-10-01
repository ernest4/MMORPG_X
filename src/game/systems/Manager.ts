import System from "../../ecs/System";
import Interactive from "../components/Interactive";
import PhysicsBody from "../components/PhysicsBody";
import Player from "../components/Player";
import Sprite from "../components/Sprite";
import Transform from "../components/Transform";

class Manager extends System {
  start(): void {
    // this.game.renderer.addPipeline("grayscale", new GrayscalePipeline(this.game));
    // this.game.renderer.addPipeline("outline", new OutlinePipeline(this.game));
    // this.add.shader()

    // console.log(this.renderer);
    // this.renderer.pipelines.add("grayscale", new GrayscalePipeline(this.game));
    // @ts-ignore
    // this.renderer.pipelines.add("skewQuad", new SkewQuadPipeline(this.game));
    // OR
    // (this.renderer as Phaser.Renderer.WebGL.WebGLRenderer).pipelines.add("skewQuad", new SkewQuadPipeline(this.game));

    // const text = this.add.text(250, 250, "Toggle UI", {
    //   backgroundColor: "white",
    //   color: "blue",
    //   fontSize: 48,
    // });

    // text.setInteractive({ useHandCursor: true });

    // text.on("pointerup", () => {
    //   store.dispatch(gameActions.showUI(!store.getState().showUi));
    // });

    // this.add.image(800, 800, "turtle").setScale(2, 2);

    // this.anims.create({
    //   key: "left",
    //   frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
    //   frameRate: 5,
    //   repeat: -1,
    // });

    // // this.anims.exists("left");

    // let sprite;
    // let spriteShadow;
    // let spriteContainer;

    // // this.dudeQuads = [];

    // can handle 40k @ 60fps; 60k at 45fps;
    // for (let i = 0; i < 40000; i++) {
    // for (let i = 0; i < 1; i++) {
    //   // hmm maybe not use containers? there's perf penalty so might be better to manually track
    //   // position of shadow sprite?
    //   // spriteContainer = this.add.container(100 + 20 * (i % 50), 300);

    //   // positions will be relative to the Container x/y
    //   sprite = this.add.sprite(100 + 20 * (i % 50), 300, "dude");
    //   sprite.setDepth(1);
    //   sprite.anims.play("left");

    //   // positions will be relative to the Container x/y
    //   spriteShadow = this.add.sprite(100 + 20 * (i % 50), 300, "dude");
    //   let scaleY = 0.4;
    //   spriteShadow.y = spriteShadow.y + (spriteShadow.height * (1 - scaleY)) / 2;
    //   spriteShadow.scaleY = scaleY;
    //   spriteShadow.setDepth(0);
    //   spriteShadow.anims.play("left");
    //   // quadPlayer.topLeftX = -10;
    //   spriteShadow.tint = 0x000000; // disable for testing grayscale shader
    //   spriteShadow.alpha = 0.5;
    //   // spriteShadow.setPipeline("grayscale"); // testing
    //   spriteShadow.setPipeline("skewQuad"); // WIP add vertex shader
    //   // spriteShadow.pipeline.set1f("inHorizontalSkew", 0.2);

    //   attachSliderControls(spriteShadow);

    //   // NOTE: order important!! depth sorting does not work within container, so items are drawn
    //   // in order they are added. Thus shadow needs to be added first.
    //   // HOWEVER: you can use container methods like bringToTop(child), bringToBack(child)... etc.
    //   // to move container children depth after they have been added too!!!
    //   // spriteContainer.add(spriteShadow);
    //   // spriteContainer.add(sprite);

    //   // this.tweens.add({
    //   //   targets: spriteContainer,
    //   //   x: 400,
    //   //   duration: 2000,
    //   //   yoyo: true,
    //   //   // delay: 1000,
    //   //   repeat: -1,
    //   // });
    // }

    for (let i = 0; i < 5; i++) {
      let x = 100 + 20 * (i % 50);
      let y = 300;

      // TODO: finish the Entity abstraction in ECS
      // let entityId = this.engine.generateEntityId();

      // let transform = new Transform(entityId);
      // transform.position.x = x;
      // transform.position.y = 200;
      // transform.scale.x = 1;
      // transform.scale.y = 1;
      // this.engine.addComponent(transform);

      // let sprite = new Sprite(entityId);
      // // sprite.textureUrl = "assets/dude.png";
      // sprite.textureUrl = i % 2 ? "assets/turtle.jpg" : "assets/dude.png";
      // sprite.frameWidth = 32;
      // sprite.frameHeight = 48;
      // this.engine.addComponent(sprite);

      // this.engine.addComponent(new PhysicsBody(entityId));
      // if (i === 0) this.engine.addComponent(new Player(entityId));

      // if (i === 1) {
      //   const interactive = new Interactive(entityId);
      //   interactive.onDrag = true;
      //   // if (i === 2) interactive.onPointerUp = true;
      //   // if (i === 3) interactive.onPointerOver = true;
      //   // if (i === 4) interactive.onPointerOut = true;
      //   this.engine.addComponent(interactive);
      // }

      // entity = new Entity(this, i);
      // entity.addComponent(new Sprite(entity, x, y, "assets/dude.png", 0, 32, 48));
      // entity.addComponent(new PhysicsBody(entity));
      // // entity.addComponent(new Shadow());
      // // entity.addComponent(new Animation());
      // // entity.addAction(new Render());
      // entity.addComponent(new Controls(entity));
      // entity.addBehavior(new Movement(entity));

      // entities.push(entity);

      // // hmm maybe not use containers? there's perf penalty so might be better to manually track
      // // position of shadow sprite?
      // // spriteContainer = this.add.container(100 + 20 * (i % 50), 300);

      // // positions will be relative to the Container x/y
      // sprite = this.add.sprite(100 + 20 * (i % 50), 300, "dude", 0);
      // sprite.setDepth(1);
      // sprite.anims.play("left");

      // // positions will be relative to the Container x/y
      // spriteShadow = this.add.sprite(100 + 20 * (i % 50), 300, "dude");
      // let scaleY = 0.4;
      // spriteShadow.y = spriteShadow.y + (spriteShadow.height * (1 - scaleY)) / 2;
      // spriteShadow.scaleY = scaleY;
      // spriteShadow.setDepth(0);
      // spriteShadow.anims.play("left");
      // // quadPlayer.topLeftX = -10;
      // spriteShadow.tint = 0x000000; // disable for testing grayscale shader
      // spriteShadow.alpha = 0.5;
      // // spriteShadow.setPipeline("grayscale"); // testing
      // spriteShadow.setPipeline("skewQuad"); // WIP add vertex shader
      // // spriteShadow.pipeline.set1f("inHorizontalSkew", 0.2);

      // attachSliderControls(spriteShadow);
    }
  }

  update(): void {}

  destroy(): void {}
}

export default Manager;
