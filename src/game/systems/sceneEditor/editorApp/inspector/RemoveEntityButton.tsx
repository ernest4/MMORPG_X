import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { isNumber } from "../../../../../ecs/utils/Number";
import * as sceneEditorActions from "../../../../store/actions/sceneEditor";

const RemoveEntityButton = () => {
  const dispatch = useDispatch();

  const currentEntityId = useSelector((state: any) => state.sceneEditor.currentEntityId);

  const onRemoveEntity = (event: any) => dispatch(sceneEditorActions.setRemoveEntity(true));

  if (!isNumber(currentEntityId)) return <div />;

  return (
    <button className="px-1 bg-red-400 rounded capitalize" onClick={onRemoveEntity}>
      remove
    </button>
  );
};

export default RemoveEntityButton;
