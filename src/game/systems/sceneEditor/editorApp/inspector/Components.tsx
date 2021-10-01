import React from "react";
import { useSelector, useDispatch } from "react-redux";
import * as sceneEditorActions from "../../../../store/actions/sceneEditor";
import Container from "../../Container";
import HorizontalSpace from "../../HorizontalSpace";
import Component from "./components/Component";

const Components = () => {
  // const currentEntityId = useSelector((state: any) => state.sceneEditor.currentEntityId);
  const currentEntityComponents = useSelector(
    (state: any) => state.sceneEditor.currentEntityComponents
  );

  return (
    <div>
      {currentEntityComponents.map((currentEntityComponent: any, key: number) => {
        return (
          <div key={key}>
            <HorizontalSpace />
            <Container>
              <Component {...{ currentEntityComponent }} />
            </Container>
          </div>
        );
      })}
    </div>
  );
};

export default Components;
