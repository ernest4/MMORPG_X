import { combineReducers } from "redux";
import game from "./game";
import sceneEditor from "./sceneEditor";

export default combineReducers({
  game,
  sceneEditor,
});
