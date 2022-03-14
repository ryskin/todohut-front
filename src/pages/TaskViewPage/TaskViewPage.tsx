import { observer } from "mobx-react-lite";
import { Motion, spring } from "react-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../../models/StoreContext";
import { useOnClickOutside } from "usehooks-ts";
import { useRef } from "react";
import Editor from "rich-markdown-editor";
import light from "rich-markdown-editor/dist/styles/theme";

export const TaskViewPage = observer(() => {
  const ref = useRef(null);
  const navigate = useNavigate();

  const handleClickOutside = () => {
    navigate(-1);
  };

  useOnClickOutside(ref, handleClickOutside);

  let { taskId } = useParams();
  const store = useStore();
  if (!taskId) return <div>No id</div>;
  const task = store.task.findById(taskId);

  const handleChangeDescription = (data: any) => {
    const text = data();
    task?.setDescription(text);
  };

  if (!task) return <div>No task</div>;
  return (
    <Motion defaultStyle={{ opacity: 0 }} style={{ opacity: spring(1) }}>
      {(interpolatingStyle) => (
        <div
          style={interpolatingStyle}
          className="backdrop-blur-sm fixed p-6 h-full w-full z-50 bg-violet-300 bg-opacity-30 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"
        >
          <div ref={ref} className=" bg-white rounded-md shadow-lg p-8 ">
            <div className="w-full ml-6 gap-1"></div>
            {task.name}
            <Editor
              theme={{ ...light, background: "rgb(249 250 251)" }}
              onChange={handleChangeDescription}
              value={task.description}
              defaultValue={store?.list?.selected?.description}
            />
          </div>
        </div>
      )}
    </Motion>
  );
});
