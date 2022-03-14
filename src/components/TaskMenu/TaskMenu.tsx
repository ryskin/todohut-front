import { ServerIcon, TrashIcon } from "@heroicons/react/outline";
import { useContextMenu } from "../../hooks/useContextMenu";
import { useStore } from "../../models/StoreContext";

export const TaskMenu = ({ outerRef }: any) => {
  const store = useStore();
  const { xPos, yPos, menu, event } = useContextMenu(outerRef);

  const id = event?.path?.[4]?.id;

  const task = store.task.findById(id);
  console.log("id", id, event?.path.map((el: any) => el));
  const handleDelete = () => {
    if (!id) {
      alert("No task selected");
      return
    };
    store.task.remove(id);
  };

  const handleChangeStatus = (status: string) => {
    const otherStatus = store.taskStatus.items.find((item) => item.name !== task?.status?.name);
    if (!otherStatus) return;
    task?.changeStatus(otherStatus.id);
  };

  const MenuItem = ({ name, onClick, icon }: { name: string, onClick: (data: any) => void, icon: JSX.Element }) => {
    return (
      <div className="flex items-center p-4 hover:bg-gray-100 cursor-pointer">
        <div className="flex items-center" onClick={onClick}>
          {icon}
          <div className="ml-2 text-sm">{name}</div>
        </div>
      </div>
    );
  }


  if (menu && id) {
    return (
      <div className="absolute bg-white rounded-md shadow-lg z-50" style={{ top: yPos, left: xPos }}>
        <div>{}</div>
        <MenuItem onClick={handleChangeStatus} name="Change status" icon={<ServerIcon className="w-4 h-4"/>}/>
        <MenuItem onClick={handleDelete} name="Delete task" icon={<TrashIcon className="w-4 h-4"/>}/>
      </div>
    );
  }
  return <></>;
};
