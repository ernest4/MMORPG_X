import React from "react";
import { useSelector, useDispatch } from "react-redux";
import * as sceneEditorActions from "../../../../store/actions/sceneEditor";

const CreateEntityButton = () => {
  const dispatch = useDispatch();

  const onCreateEntity = (event: any) => dispatch(sceneEditorActions.setCreateEntity(true));

  return (
    <button className="p-3 text-white bg-blue-400 rounded capitalize" onClick={onCreateEntity}>
      create new entity
    </button>
  );
};

export default CreateEntityButton;
