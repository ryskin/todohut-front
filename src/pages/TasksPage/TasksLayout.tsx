import { DocumentTextIcon } from "@heroicons/react/solid";
import { observer } from "mobx-react-lite";
import Editor from "rich-markdown-editor";
import { AddListForm } from "../../components/AddListForm/AddListForm";
import { ToDoTable } from "../../components/ToDoTable";
import { useStore } from "../../models/StoreContext";
import mainImage from "../../assets/main.png";
import { light } from "rich-markdown-editor/dist/styles/theme";
import { Outlet } from "react-router-dom";
import { ListContextMenu } from "../../components/ListContextMenu";
import { useEffect, useRef, useState } from "react";
import {
  roundDecimal,
  secondsToHHMM,
  secondsToHHMMSS,
} from "../../utils/basic";

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
      className={`${
        selected ? "border-l-blue-500 border-l-4 " : ""
      } flex flex-row p-2 cursor-pointer justify-between items-center border-b bg-white gray-600 text-sm`}
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
  const outerRef = useRef(null);

  const handleListItemClick = (listId: string) => {
    list.setCurrentList(listId);
  };

  return (
    <div ref={outerRef}>
      <ListContextMenu outerRef={outerRef} />
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
  const [editorInitialValue, setEditorInitialValue] = useState(
    store?.list?.selected?.description
  );

  const handleChangeDescription = (data: any) => {
    const text = data();
    store?.list?.selected?.setDescription(text);
  };

  useEffect(() => {
    setEditorInitialValue(store?.list?.selected?.description);
  }, [store?.list?.selected]);

  const totalBudget = store?.list?.selected?.tasks.reduce(
    (acc: number, task: any) => acc + task.budget,
    0
  );

  const totalEstimatedTime = store?.list?.selected?.tasks.reduce(
    (acc: number, task: any) => acc + task.timeEstimate,
    0
  );

  const spendTime = store?.list?.selected?.tasks.reduce(
    (acc: number, task: any) => acc + task.spendTime,
    0
  );

  const totalSpendMoney = store?.list?.selected?.tasks.reduce(
    (acc: number, task: any) => acc + task.spendMoney,
    0
  );

  return (
    <>
      <Outlet />
      <div className="w-64 bg-gray-100 flex flex-col space-y-4">
        <div>
          <div className="flex flex-row justify-between items-center p-4 mb-2">
            <h1 className="flex-auto font-semibold text-xl">Lists</h1>
          </div>
          <ListItems />
          <div className="">
            <AddListForm />
          </div>
        </div>
      </div>
      <div className="flex-auto bg-gray-50 border-l rounded-tl-xl shadow-2xl">
        <div className="p-6">
          {
            <div className="p-4 bg-gray-50">
              <Editor
                theme={{ ...light, background: "rgb(249 250 251)" }}
                onChange={handleChangeDescription}
                value={editorInitialValue}
                defaultValue={store?.list?.selected?.description}
              />
            </div>
          }
          <div className="flex flex-row gap-2">
            {!!totalBudget && (
              <div className="flex border- flex-col justify-between p-4 mb-2 uppercase bg-yellow-400 rounded-lg">
                <h1 className="flex-auto font-semibold text-sm text-gray-500">
                  Budget
                </h1>
                ${totalBudget}
              </div>
            )}

            {!!totalEstimatedTime && (
              <div className="flex border- flex-col justify-between p-4 mb-2 uppercase bg-blue-200 rounded-lg ">
                <h1 className="flex-auto font-semibold text-sm text-gray-500">
                  Time Estimate
                </h1>
                {secondsToHHMM(totalEstimatedTime)}
              </div>
            )}
            {!!spendTime && (
              <div className="flex border- flex-col justify-between p-4 mb-2 uppercase bg-green-200 rounded-lg ">
                <h1 className="flex-auto font-semibold text-sm text-gray-500">
                  Time Spend
                </h1>
                {secondsToHHMMSS(spendTime)}
              </div>
            )}
            {!!totalSpendMoney && (
              <div className="flex border- flex-col justify-between p-4 mb-2 uppercase bg-purple-200 rounded-lg ">
                <h1 className="flex-auto font-semibold text-sm text-gray-500">
                  Money Spend
                </h1>
                {roundDecimal(totalSpendMoney, 2)}
              </div>
            )}
          </div>
          {store.list.selected ? <ToDoTable /> : <img src={mainImage} alt="" />}
        </div>
      </div>
    </>
  );
});
