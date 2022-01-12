import { DocumentTextIcon, UserIcon, SearchIcon } from "@heroicons/react/outline";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { AddListForm } from "../../components/AddListForm/AddListForm";
import { AddUserForm } from "../../components/AddUserForm";
import { Modal } from "../../components/Modal";
import { useStore } from "../../models/StoreContext";
import { UserSnapshot } from "../../models/User/UserModel";

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
  
  export const TasksList = observer(() => {
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
          selected ? "bg-blue-200" : "bg-white"
        } flex mb-2 flex-row p-2 cursor-pointer justify-between items-center rounded-xl border-b gray-600 text-sm`}
      >
        <div className="flex flex-row items-center pointer-events-none">
          <DocumentTextIcon className="w-5 h-5 ml-2 mr-2 text-blue-500" />
          <div>{name}</div>
        </div>
        <div className="grid justify-items-center	 mr-2 text-xs items-center bg-gray-400 w-5 h-5 rounded-full text-white">
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
            tasksCount="0"
          />
        ))}
      </div>
    );
  });
  
  const AddUserModal = observer(
    ({ clickComponent }: { clickComponent: JSX.Element }) => {
      const store = useStore();
  
      const [closeModal, setCloseModal] = React.useState(false);
  
      const handleCreateUser = (user: UserSnapshot) => {
        store.user.add(user);
        setCloseModal((prev) => !prev);
      };
  
      return (
        <Modal title="Add user" clickComponent={clickComponent} closeFromParent={closeModal}>
          <AddUserForm handleCreate={handleCreateUser} />
        </Modal>
      );
    }
  );
  
export const MainLayout = () => {
    return(
        <div className="flex flex-row min-h-screen bg-gray-100">
        <div className="flex flex-col justify-between items-center w-16 p-4">
          <div className="space-y-2">
            <AddUserModal
              clickComponent={
                <div className="cursor-pointer rounded-full bg-gray-200 w-8 h-8 flex justify-center items-center">
                  <UserIcon className="w-5 h-5 text-gray-400" />
                </div>
              }
            />
            <div className="rounded-full bg-gray-200 w-8 h-8"></div>
            <div className="rounded-full bg-gray-200 w-8 h-8"></div>
            <div className="rounded-full bg-gray-200 w-8 h-8"></div>
            <div className="rounded-full bg-gray-200 w-8 h-8"></div>
            <div className="rounded-full bg-gray-200 w-8 h-8"></div>
          </div>
          <div className="space-y-2">
            <div className="rounded-full bg-gray-200 w-8 h-8"></div>
            <div className="rounded-full bg-gray-200 w-8 h-8"></div>
            <div className="rounded-full bg-gray-200 w-8 h-8"></div>
          </div>
        </div>
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
            <Outlet />
          </div>
        </div>
      </div>       
    )
}
