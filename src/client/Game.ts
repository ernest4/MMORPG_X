import Phaser from "phaser";
import Main from "./Main";
// import FpsCounter from "./utils/FpsCounter";

const PHASER_GAME_CONFIG = {
  type: Phaser.WEBGL,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: "phaser-game",
  pixelArt: true, // NOTE: prevents anti-aliasing
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  // pixelArt: true, // how to set?
  physics: { default: "arcade", arcade: { debug: false, gravity: { y: 0 } } },
  scene: [Main],
};

class Game {
  run = () => new Phaser.Game(PHASER_GAME_CONFIG);
}

export default Game;
