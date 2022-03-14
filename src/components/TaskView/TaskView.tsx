import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import light from "rich-markdown-editor/dist/styles/theme";
import { useStore } from "../../models/StoreContext";
import Editor from "rich-markdown-editor";

export const TaskView = observer(() => {
  const { id } = useParams();
  const store = useStore();
  const task = store.task.findById(String(id));

  const [editorInitialValue, setEditorInitialValue] = useState(
    store?.list?.selected?.description
  );

  const handleChangeDescription = (data: any) => {
    const text = data();
    task?.setDescription(text);
  };

  useEffect(() => {
    setEditorInitialValue(store?.list?.selected?.description);
  }, [store?.list?.selected]);

  return (
    <div>
      <h1>{id}</h1>
      <div className="p-4 bg-gray-50">
        <Editor
          theme={{ ...light, background: "rgb(249 250 251)" }}
          onChange={handleChangeDescription}
          value={editorInitialValue}
          defaultValue={store?.list?.selected?.description}
        />
      </div>
    </div>
  );
});
