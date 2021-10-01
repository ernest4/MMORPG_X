import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { isNumber } from "../../../../../ecs/utils/Number";
import * as sceneEditorActions from "../../../../store/actions/sceneEditor";

const CloneEntityButton = () => {
  const dispatch = useDispatch();

  const currentEntityId = useSelector((state: any) => state.sceneEditor.currentEntityId);

  const onCloneEntity = (event: any) => dispatch(sceneEditorActions.setCloneEntity(true));

  if (!isNumber(currentEntityId)) return <div />;

  return (
    <button className="px-1 bg-yellow-400 rounded capitalize" onClick={onCloneEntity}>
      clone
    </button>
  );
};

export default CloneEntityButton;
