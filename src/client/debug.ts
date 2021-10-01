// import { Scene } from "babylonjs";
// import { AdvancedDynamicTexture } from "babylonjs-gui";

const DEBUG = process.env.DEBUG_LOG === "true" || process.env.NODE_ENV !== "production";

// export const showFPS = (advancedTexture: AdvancedDynamicTexture, scene: Scene) => {
//   var fpsContainer = new BABYLON.GUI.Rectangle();
//   // fpsContainer.width = 0.2;
//   fpsContainer.width = "90px";
//   fpsContainer.height = "32px";
//   // fpsContainer.cornerRadius = 4;
//   fpsContainer.thickness = 0;
//   // fpsContainer.color = "White";
//   fpsContainer.background = "black";
//   fpsContainer.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
//   fpsContainer.verticalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_TOP;
//   advancedTexture.addControl(fpsContainer);

//   const fpsText = new BABYLON.GUI.TextBlock();
//   // fpsText.text = "Hello world";
//   fpsText.color = "white";
//   fpsText.fontSize = 24;
//   // fpsText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
//   // fpsText.textVerticalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_TOP;
//   // fpsText.paddingTop = -100;
//   fpsContainer.addControl(fpsText);

//   scene.onBeforeRenderObservable.add(() => {
//     fpsText.text = `${scene.getEngine().getFps().toFixed()} fps`;
//   });
// };
