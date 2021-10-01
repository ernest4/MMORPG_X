import React from "react";
import Inspector from "./editorApp/Inspector";
import SerializeButton from "./editorApp/SerializeButton";
import VerticalSpace from "./VerticalSpace";

const EditorApp = () => {
  // const dispatch = useDispatch();
  // const test = useSelector((state: any) => state.sceneEditor.test);

  // const [value, setValue] = useState(123);

  // useEffect(() => {
  //   window.addEventListener("resize", handleResize);
  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);

  // TODO: serialize button & functionality (system, event entity driven) ....

  return (
    <div className="fixed top-0 flex justify-end w-screen">
      <SerializeButton />
      <VerticalSpace />
      <Inspector />
    </div>
  );
};

export default EditorApp;
