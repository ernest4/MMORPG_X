import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Component from "../../../../../ecs/Component";
import { isNumber } from "../../../../../ecs/utils/Number";
import * as sceneEditorActions from "../../../../store/actions/sceneEditor";

const AddComponentButton = () => {
  const dispatch = useDispatch();

  const currentEntityId = useSelector((state: any) => state.sceneEditor.currentEntityId);

  const componentsAddList = useSelector(
    (state: any) => state.sceneEditor.currentEntityComponentsAddList
  );

  const availableComponentsList = useSelector(
    (state: any) => state.sceneEditor.availableComponentsList
  );

  const currentEntityComponents = useSelector(
    (state: any) => state.sceneEditor.currentEntityComponents
  );

  const extraAvailableComponents = availableComponentsList.filter(
    (availableComponentName: string) => {
      return !currentEntityComponents.some(
        (currentEntityComponent: Component) =>
          currentEntityComponent.constructor.name === availableComponentName
      );
    }
  );

  const onChange = (event: any) => {
    if (!componentsAddList) return;

    dispatch(
      sceneEditorActions.setCurrentEntityComponentsAddList([
        ...new Set([...componentsAddList, event.target.value]), // NOTE: Set is for easy way to get unique values
      ])
    );
  };

  if (!isNumber(currentEntityId)) return <div />;

  return (
    <select
      value={"Add Component"}
      onChange={onChange}
      className="rounded bg-gray-400 p-2 text-white700"
    >
      <option value={"Add Component"}>Add Component</option>
      {extraAvailableComponents.map((extraAvailableComponent: string, key: number) => {
        return (
          <option value={extraAvailableComponent} key={key}>
            {extraAvailableComponent}
          </option>
        );
      })}
    </select>
  );
};

export default AddComponentButton;
