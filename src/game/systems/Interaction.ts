import { Engine } from "../../ecs";
import System from "../../ecs/System";
import {
  DraggableObject,
  EntityId,
  InteractiveEventType,
  InteractiveObject,
  QuerySet,
} from "../../ecs/types";
import Sprite from "../components/Sprite";
import Interactive from "../components/Interactive";
import InteractiveEvent from "../components/InteractiveEvent";
import SparseSet from "../../ecs/utils/SparseSet";
import { Scene } from "phaser";

import DragEvent from "../components/DragEvent";
import { isNumber } from "../../ecs/utils/Number";

class Interaction extends System {
  private _scene: Scene;
  private _interactiveEventObjectBuffer: InteractiveObject[];
  private _dragEventObjectBuffer: DraggableObject[];
  private _interactiveComponentsSet: SparseSet;

  constructor(engine: Engine, scene: Scene) {
    super(engine);
    this._scene = scene;
    this._interactiveEventObjectBuffer = [];
    this._dragEventObjectBuffer = [];
    this._interactiveComponentsSet = new SparseSet();
  }

  start(): void {
    this._scene.input.on("drag", (pointer: any, gameObject: any, dragX: number, dragY: number) => {
      const entityId = gameObject._ERNEST_GAME_entityId;
      if (isNumber(entityId)) this.spriteDragEventHandler(entityId, dragX, dragY);
    });
  }

  // TODO: end goal is to generate event components ('InteractiveEvent') that correspond to the appropriate entity ??
  update(): void {
    this.engine.query(this.registerInteractiveEntityListeners, Interactive);
    this.disposeUnusedInteractiveComponents();

    // TODO: deal with creation and removal of InteractiveEvent components
    this.engine.query(this.cleanUpInteractiveEventComponents, InteractiveEvent);
    this.createInteractiveEventComponents();

    // TODO: deal with creation and removal of DragEvent components
    this.engine.query(this.cleanUpDragEventComponents, DragEvent);
    this.createDragEventComponents();
  }

  destroy(): void {}

  private spriteDragEventHandler = (entityId: EntityId, dragX: any, dragY: any) => {
    this._dragEventObjectBuffer.push({ entityId, dragX, dragY });
  };

  private registerInteractiveEntityListeners = (querySet: QuerySet) => {
    const [interactive] = querySet as [Interactive];

    const sprite = this.engine.getComponent<Sprite>(Sprite, interactive.id);

    // NOTE: Interactive without Sprite doesn't make sense, so dispose of it
    if (!sprite) return this.disposeUnusedInteractiveComponent(interactive);
    if (!sprite.loaded) return; // NOTE: sprite not ready to register listeners yet
    if (interactive.loaded) return (interactive.processed = true);

    // We have a a valid new Interactive component, or existing one with listener changes...
    const phaserSprite = sprite.phaserSpriteRef!;
    phaserSprite.setInteractive(); // TODO: leak? once attached this wont go away... could clean up but does it matter ??

    const spriteInteractionEventHandler = (type: InteractiveEventType) => {
      this._interactiveEventObjectBuffer.push({ type, entityId: interactive.id });
    };

    // deregister all listeners
    this.deregisterInteractiveListeners(phaserSprite);

    // re-register relevant listeners
    if (interactive.onPointerDown) {
      phaserSprite.on(InteractiveEventType.POINTER_DOWN, () =>
        spriteInteractionEventHandler(InteractiveEventType.POINTER_DOWN)
      );
    }

    if (interactive.onPointerUp) {
      phaserSprite.on(InteractiveEventType.POINTER_UP, () =>
        spriteInteractionEventHandler(InteractiveEventType.POINTER_UP)
      );
    }

    if (interactive.onPointerOver) {
      phaserSprite.on(InteractiveEventType.POINTER_OVER, () =>
        spriteInteractionEventHandler(InteractiveEventType.POINTER_OVER)
      );
    }

    if (interactive.onPointerOut) {
      phaserSprite.on(InteractiveEventType.POINTER_OUT, () =>
        spriteInteractionEventHandler(InteractiveEventType.POINTER_OUT)
      );
    }

    if (interactive.onDrag) {
      // @ts-ignore
      phaserSprite._ERNEST_GAME_entityId = interactive.id; // NOTE: monkey patching Phaser 3 Sprite
      this._scene.input.setDraggable(phaserSprite, true);
    }

    interactive.loaded = true;
    interactive.processed = true; // NOTE: mark scene items as processed, so disposeUnusedInteractiveComponents() leaves it alone

    // keep track of interactive component ref
    this._interactiveComponentsSet.add(interactive);
  };

  deregisterInteractiveListeners = (phaserSprite: Phaser.GameObjects.Sprite) => {
    // TODO: if you update this, need to update same method in Render... maybe Render should call this methods itself !!!
    phaserSprite.off(InteractiveEventType.POINTER_DOWN);
    phaserSprite.off(InteractiveEventType.POINTER_UP);
    phaserSprite.off(InteractiveEventType.POINTER_OVER);
    phaserSprite.off(InteractiveEventType.POINTER_OUT);
    this._scene.input.setDraggable(phaserSprite, false);
  };

  private disposeUnusedInteractiveComponents = () => {
    this._interactiveComponentsSet.stream((interactive: Interactive) => {
      this.disposeUnusedInteractiveComponent(interactive);
    });
  };

  private disposeUnusedInteractiveComponent = (interactive: Interactive) => {
    if (interactive.processed) {
      interactive.processed = false; // NOTE: reset the flag before next update
      return;
    }

    const sprite = this.engine.getComponent<Sprite>(Sprite, interactive.id);

    const phaserSprite = sprite?.phaserSpriteRef;

    // deregister listeners if phaser sprite ref present. If sprite not present, then it must have
    // de-registered all listeners before removal anyway.
    if (phaserSprite) this.deregisterInteractiveListeners(phaserSprite);

    this._interactiveComponentsSet.remove(interactive);
    // NOTE: Interactive without Sprite doesn't make sense, so remove it from entity
    if (!sprite) this.engine.removeComponent(interactive);
  };

  // any input events that have travelled full circle and weren't removed by any system are removed
  private cleanUpInteractiveEventComponents = (querySet: QuerySet) => {
    const [interactiveEvent] = querySet as [InteractiveEvent];

    this.engine.removeComponent(interactiveEvent);
  };

  // any input events that have travelled full circle and weren't removed by any system are removed
  private cleanUpDragEventComponents = (querySet: QuerySet) => {
    const [dragEvent] = querySet as [DragEvent];

    this.engine.removeComponent(dragEvent);
  };

  // NOTE: these get attached to same entity (so only 1 exists at a time?? buggy ??)
  private createInteractiveEventComponents = () => {
    this._interactiveEventObjectBuffer.forEach(({ type, entityId }) => {
      const interactiveEvent = new InteractiveEvent(entityId);
      interactiveEvent.type = type;
      this.engine.addComponent(interactiveEvent);
    });

    this._interactiveEventObjectBuffer = [];
  };

  // NOTE: these get attached to same entity (so only 1 exists at a time?? buggy ??)
  private createDragEventComponents = () => {
    this._dragEventObjectBuffer.forEach(({ entityId, dragX, dragY }) => {
      const dragEvent = new DragEvent(entityId);
      dragEvent.dragX = dragX;
      dragEvent.dragY = dragY;
      this.engine.addComponent(dragEvent);
    });

    this._dragEventObjectBuffer = [];
  };
}

export default Interaction;
