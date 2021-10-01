import React from "react";
import { useSelector, useDispatch } from "react-redux";
import HorizontalSpace from "../../../HorizontalSpace";
import * as sceneEditorActions from "../../../../../store/actions/sceneEditor";
import RemoveButton from "./component/RemoveButton";
import Title from "./component/Title";
import Value from "./component/Value";

const Component = ({ currentEntityComponent }: any) => {
  return (
    <div>
      <div className="flex justify-between pb-4 border-b-2">
        <Title title={currentEntityComponent.constructor.name} />
        <RemoveButton component={currentEntityComponent} />
      </div>
      <HorizontalSpace />
      <div>
        {Object.entries(currentEntityComponent).map(([property, value], key) => {
          if (property === "_id") return <div key={key} />; // NOTE: just hiding redundant exposition of internal implementation
          if (property === "_values") return <div key={key} />; // NOTE: just hiding redundant exposition of internal implementation
          if (property === "loaded") return <div key={key} />; // NOTE: just hiding redundant exposition of internal implementation
          if (property === "processed") return <div key={key} />; // NOTE: just hiding redundant exposition of internal implementation
          if (property === "_serializable") return <div key={key} />; // NOTE: just hiding redundant exposition of internal implementation

          return (
            <div key={key}>
              <HorizontalSpace />
              <div className="flex justify-between">
                <div className="w-max">{property}</div>
                <Value
                  {...{ componentName: currentEntityComponent.constructor.name, property, value }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Component;
