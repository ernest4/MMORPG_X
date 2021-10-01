import { Game as PhaserGame } from "phaser";
import Main from "./game/scenes/Main";

class Game {
  private _config: any;

  constructor() {
    this._config = {
      type: Phaser.WEBGL,
      width: window.innerWidth,
      height: window.innerHeight,
      parent: "phaser-game",
      pixelArt: true, // NOTE: prevents anti-aliasing
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      // scene: [Main, UI], // TODO: UI scene!!
      scene: [Main], // TODO: will dynamically load other scenes, like Car dash UI, Aircraft UI etc.
    };
  }

  start = () => {
    new PhaserGame(this._config);
  };
}

export default Game;
