import "jest-extended";
// NOTE: more custom type examples
// type Foot = number;
// type Pound = number;

import Component from "./Component";

// type Patient = {
//   name: string;
//   height: Foot;
//   weight: Pound;
// };

// enum to number type hack, to force type hints to show the type, rather number, make it empty enum
// which is any number, but only of type enum :)
// https://stackoverflow.com/questions/43831683/can-i-declare-custom-number-types-in-typescript
// type DeltaTime = number; // ms
// type EntityId = number;
enum DeltaTime {} // ms
enum EntityId {}
type QuerySet = Component[];
type QueryCallback = (querySet: QuerySet) => void;
// type ComponentClass = {
//   name: string;
//   prototype: Component;
//   new (entityId: EntityId, ...arguments: any[]): Component;
// };

type ComponentClass<T extends Component> = {
  name: string;
  prototype: T;
  new (entityId: EntityId, ...arguments: any[]): T;
};

// NOTE: using string enums over number enums as number enums are not enforceable in the type check!
// https://stackoverflow.com/questions/57334349/typescript-why-is-exact-enum-type-not-enforced
declare const enum ShapeType {
  BOX = "0",
  SPHERE = "1",
}

declare const enum Vector3ViewIndexes {
  X = 0,
  Y = 1,
  Z = 2,
}

declare const enum ColliderValueIndexes {
  SHAPE_TYPE = 0,
  SPHERE_RADIUS = 1,
  BOX_SIZE_X = 2,
  BOX_SIZE_Y = 3,
  BOX_SIZE_Z = 4,
}

declare const enum InteractiveEventType {
  POINTER_DOWN = "pointerdown",
  POINTER_UP = "pointerup",
  POINTER_OVER = "pointerover",
  POINTER_OUT = "pointerout",
}
type InteractiveObject = { type: InteractiveEventType; entityId: EntityId };

type DraggableObject = { entityId: EntityId; dragX: number; dragY: number };

type BoxColliderSize = { x: number; y: number; z: number };

type URL = string;
