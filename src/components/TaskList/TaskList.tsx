import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useStore } from "../../models/StoreContext";
import { TaskItem } from "../../pages/TasksPage/TasksLayout";


export const TaskList = observer(() => {
  const [tasksList, setTasksList] = React.useState<any>([]);
  const store = useStore();

  useEffect(() => {
    setTasksList(
      store.task.items.filter(
        (task) => task.list?.id === store.list.selected?.id
      )
    );
  }, [store.list.selected?.id, store.task.items, store.task.items.length]);
  return (
    <div>
      <h1>{store.list.selected?.name}</h1>
      {tasksList.map((task: any) => (
        <TaskItem key={task.id} {...task} />
      ))}
    </div>
  );
});
