import React from "react";
import { useSelector, useDispatch } from "react-redux";
import * as sceneEditorActions from "../../../store/actions/sceneEditor";

const SerializeButton = () => {
  const dispatch = useDispatch();

  const onSerialize = (event: any) => dispatch(sceneEditorActions.setSerialize(true));

  return (
    <button
      className="px-4 py-2 bg-yellow-400 rounded capitalize h-full text-white"
      onClick={onSerialize}
    >
      serialize
    </button>
  );
};

export default SerializeButton;
