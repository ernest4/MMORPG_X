import React from "react";
import { useSelector } from "react-redux";
import Container from "../Container";
import HorizontalSpace from "../HorizontalSpace";
import AddComponentButton from "./inspector/AddComponentButton";
import CloneEntityButton from "./inspector/CloneEntityButton";
import Components from "./inspector/Components";
import CreateEntityButton from "./inspector/CreateEntityButton";
import RemoveEntityButton from "./inspector/RemoveEntityButton";

const STYLE = { height: "100vh" };
const Inspector = () => {
  const currentEntityId = useSelector((state: any) => state.sceneEditor.currentEntityId);

  return (
    <div
      className="bg-gray-600 flex flex-col w-96 overflow-y-scroll"
      style={STYLE}
    >
      <CreateEntityButton />
      <HorizontalSpace />
      <div className="p-4 bg-gray-500 text-white rounded sticky top-0 border-b-2">
        <div className="flex justify-between">
          <div>Entity Id: {currentEntityId}</div>
          <CloneEntityButton />
          <RemoveEntityButton />
        </div>
      </div>
      <Components />
      <HorizontalSpace />
      <AddComponentButton />
      <HorizontalSpace />
    </div>
  );
};

export default Inspector;
