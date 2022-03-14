import { TrashIcon } from "@heroicons/react/outline";
import { useContextMenu } from "../../hooks/useContextMenu";
import { useStore } from "../../models/StoreContext";

export const ListContextMenu = ({ outerRef }: any) => {
  const store = useStore();
  const { xPos, yPos, menu, event } = useContextMenu(outerRef);

  const id = event?.path?.[0]?.id;

  const list = store.list.findById(id);

  const MenuItem = ({
    name,
    onClick,
    icon,
  }: {
    name: string;
    onClick: (data: any) => void;
    icon: JSX.Element;
  }) => {
    return (
      <div className="flex items-center p-4 hover:bg-gray-100 cursor-pointer">
        <div className="flex items-center" onClick={onClick}>
          {icon}
          <div className="ml-2 text-sm">{name}</div>
        </div>
      </div>
    );
  };

  const handleChangeStatus = () => {
    if (!list) {
      alert("No list selected");
      return;
    }
    store.list.remove(list.id);
  };

  if (menu && list) {
    return (
      <div
        className="absolute bg-white rounded-md shadow-lg z-50"
        style={{ top: yPos, left: xPos }}
      >
        <div>{}</div>
        <MenuItem
          onClick={handleChangeStatus}
          name={`Delete ${list.name}`}
          icon={<TrashIcon className="w-4 h-4" />}
        />
      </div>
    );
  }

  return <></>;
};
