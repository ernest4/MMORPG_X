import "./css/main.css"; // including here ensures it's in the project
import { DEVELOPMENT } from "../shared/utils/environment";
import Game from "./Game";

const game = new Game();
game.run();

console.log(`Running in ${DEVELOPMENT ? "dev" : "prod"} mode`);
