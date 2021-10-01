import React, { StrictMode } from "react";
import { Provider } from "react-redux";
import ReactDOM from "react-dom";

import store from "../../store";
import EditorApp from "./EditorApp";

const EDITOR_ROOT_ID = "editor_root";

const editorRootElement = document.createElement("div");
editorRootElement.id = EDITOR_ROOT_ID;
document.body.appendChild(editorRootElement);

const initSceneEditor = () =>
  ReactDOM.render(
    <StrictMode>
      <Provider store={store}>
        <EditorApp />
      </Provider>
    </StrictMode>,
    document.getElementById(EDITOR_ROOT_ID)
  );

export default initSceneEditor;
