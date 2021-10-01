import React from "react";
import { useSelector, useDispatch } from "react-redux";
import HorizontalSpace from "../../../../HorizontalSpace";
import * as sceneEditorActions from "../../../../../../store/actions/sceneEditor";

const Value = (props: any) => {
  return <div className="w-max overflow-scroll">{getValueEditor(props)}</div>;
};

export default Value;

// TODO: figure out how to push changes to redux and sync them to game...

const getValueEditor = ({ value, ...props }: any) => {
  if (value._values) return VectorEditor({ value, ...props });
  if (typeof value === "boolean") return BooleanEditor({ value, ...props });
  if (typeof value === "string") return StringEditor({ value, ...props });
  if (!isNaN(value)) return NumberEditor({ value, ...props });

  return JSON.stringify(value); // unknown / ref / catch all
};

const VectorEditor = ({
  componentName,
  property,
  value: {
    _values: { 0: x, 1: y, 2: z },
  },
}: {
  componentName: string;
  property: string;
  value: any;
}) => {
  const dispatch = useDispatch();

  const currentEntityComponentsUpdateHash = useSelector(
    (state: any) => state.sceneEditor.currentEntityComponentsUpdateHash
  );

  const onChange = ({ target: { value, name } }: any) => {
    if (!currentEntityComponentsUpdateHash) return;
    if (value === "") return;

    const currentComponent = currentEntityComponentsUpdateHash[componentName];

    dispatch(
      sceneEditorActions.setCurrentEntityComponentsUpdateHash({
        ...currentEntityComponentsUpdateHash,
        [componentName]: { ...currentComponent, [`${property}.${name}`]: parseFloat(value) },
      })
    );
  };

  return (
    <div>
      <div className="flex pb-1">
        <div className="pr-4">x</div>
        <input
          type="number"
          value={x}
          name="x"
          className="rounded p-1 bg-gray-700"
          onChange={onChange}
        />
      </div>
      <div className="flex pb-1">
        <div className="pr-4">y</div>
        <input
          type="number"
          value={y}
          name="y"
          className="rounded p-1 bg-gray-700"
          onChange={onChange}
        />
      </div>
      <div className="flex pb-1">
        <div className="pr-4">z</div>
        <input
          type="number"
          value={z}
          name="z"
          className="rounded p-1 bg-gray-700"
          onChange={onChange}
        />
      </div>
    </div>
  );
};

const BooleanEditor = ({
  componentName,
  property,
  value,
}: {
  componentName: string;
  property: string;
  value: boolean;
}) => {
  const dispatch = useDispatch();

  const currentEntityComponentsUpdateHash = useSelector(
    (state: any) => state.sceneEditor.currentEntityComponentsUpdateHash
  );

  const onChange = ({ target: { value } }: any) => {
    if (!currentEntityComponentsUpdateHash) return;

    const currentComponent = currentEntityComponentsUpdateHash[componentName];

    dispatch(
      sceneEditorActions.setCurrentEntityComponentsUpdateHash({
        ...currentEntityComponentsUpdateHash,
        [componentName]: { ...currentComponent, [property]: value === "true" },
      })
    );
  };

  return (
    <select value={value.toString()} onChange={onChange} className="rounded p-1 bg-gray-700">
      <option value="true">true</option>
      <option value="false">false</option>
    </select>
  );
};

const StringEditor = ({
  componentName,
  property,
  value,
}: {
  componentName: string;
  property: string;
  value: string;
}) => {
  const dispatch = useDispatch();

  const currentEntityComponentsUpdateHash = useSelector(
    (state: any) => state.sceneEditor.currentEntityComponentsUpdateHash
  );

  const onChange = ({ target: { value } }: any) => {
    if (!currentEntityComponentsUpdateHash) return;

    const currentComponent = currentEntityComponentsUpdateHash[componentName];

    dispatch(
      sceneEditorActions.setCurrentEntityComponentsUpdateHash({
        ...currentEntityComponentsUpdateHash,
        [componentName]: { ...currentComponent, [property]: value },
      })
    );
  };

  return (
    <input type="text" value={value} className="rounded p-1 bg-gray-700" onChange={onChange} />
  );
};

const NumberEditor = ({
  componentName,
  property,
  value,
}: {
  componentName: string;
  property: string;
  value: number;
}) => {
  const dispatch = useDispatch();

  const currentEntityComponentsUpdateHash = useSelector(
    (state: any) => state.sceneEditor.currentEntityComponentsUpdateHash
  );

  const onChange = ({ target: { value } }: any) => {
    if (!currentEntityComponentsUpdateHash) return;
    if (value === "") return;

    const currentComponent = currentEntityComponentsUpdateHash[componentName];

    dispatch(
      sceneEditorActions.setCurrentEntityComponentsUpdateHash({
        ...currentEntityComponentsUpdateHash,
        [componentName]: { ...currentComponent, [property]: parseFloat(value) },
      })
    );
  };

  return (
    <input type="number" value={value} className="rounded p-1 bg-gray-700" onChange={onChange} />
  );
};
