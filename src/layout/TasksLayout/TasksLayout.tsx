import { DocumentTextIcon, SearchIcon } from "@heroicons/react/solid";
import { observer } from "mobx-react-lite";
import React from "react";
import { AddListForm } from "../../components/AddListForm/AddListForm";
import { ToDoTable } from "../../components/ToDoTable";
import { useStore } from "../../models/StoreContext";
import mainImage from "../../assets/main.png";

type ITaskItem = {
  id: string;
  name: string;
  list: any;
};

export const TaskItem = (task: ITaskItem) => {
  const { name, id } = task;
  return (
    <div className="flex flex-auto flex-row p-2">
      <div className="mr-4">{id}</div>
      <div>{name}</div>
    </div>
  );
};

export const TaskStatusItem = (taskStatus: any) => {
  const { name, id } = taskStatus;
  return (
    <div className="flex flex-auto flex-row p-2">
      <div className="mr-4">{id}</div>
      <div>{name}</div>
    </div>
  );
};

export const TaskStatusList = observer(() => {
  const store = useStore();
  return (
    <div>
      {store.taskStatus.items?.map((taskStatus: any) => (
        <div key={taskStatus.id}>
          <TaskStatusItem {...taskStatus} />
          {taskStatus.selectedListTasks.map((task: any) => (
            <TaskItem key={task.id} {...task} />
          ))}
        </div>
      ))}
    </div>
  );
});

const ListItem = ({
  name,
  tasksCount,
  id,
  onClick,
  selected,
}: {
  name: string;
  tasksCount: string;
  id: string;
  selected: boolean;
  onClick: (listId: string) => void;
}) => {
  const onClickHandler = (event: any) => {
    event.stopPropagation();
    event.preventDefault();
    const listId = event.target.id;
    onClick(listId);
  };
  return (
    <div
      id={id}
      onClick={onClickHandler}
      className={`${selected ? "bg-blue-200" : "bg-white"
        } flex mb-2 flex-row p-2 cursor-pointer justify-between items-center rounded-xl border-b gray-600 text-sm`}
    >
      <div className="flex flex-row items-center pointer-events-none">
        <DocumentTextIcon className="w-5 h-5 ml-2 mr-2 text-blue-500" />
        <div>{name}</div>
      </div>
      <div className="grid justify-items-center	mr-2 text-xs items-center bg-gray-400 w-5 h-5 rounded-full text-white">
        {tasksCount}
      </div>
    </div>
  );
};


const ListItems = observer(() => {
  const store = useStore();
  const { list } = store;

  const handleListItemClick = (listId: string) => {
    list.setCurrentList(listId);
  };

  return (
    <div>
      {list.items.map((listItem) => (
        <ListItem
          name={listItem.name}
          onClick={handleListItemClick}
          key={listItem.id}
          id={listItem.id}
          selected={listItem.id === list?.selected?.id}
          tasksCount={String(listItem.tasks.length)}
        />
      ))}
    </div>
  );
});

export const TasksLayout = observer(() => {
  const store = useStore();

  return (
    <>
      <div className="w-64 bg-gray-100 p-4 flex flex-col space-y-4">
        <div>
          <div className="flex flex-row justify-between items-center mb-6">
            <h1 className="flex-auto font-semibold text-xl">Lists</h1>
            <SearchIcon className="w-5 h-5 flex-none" />
          </div>
          <ListItems />
          <div className="">
            <AddListForm />
          </div>
        </div>
      </div>
      <div className="flex-auto bg-gray-50 border-l rounded-tl-xl shadow-2xl p4">
        <div className="p-6">
          {store.list.selected ? <ToDoTable/> : <img src={mainImage} alt=""/>}
        </div>
      </div>
    </>
  );
});
