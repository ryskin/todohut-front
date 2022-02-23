import { useContextMenu } from "../../hooks/useContextMenu";
import { useStore } from "../../models/StoreContext";

export const ListContextMenu = ({ outerRef }: any) => {
  const store = useStore();
  const { xPos, yPos, menu, event } = useContextMenu(outerRef);

  const id = event?.path?.[0]?.id;

  const list = store.list.findById(id);

  if (menu && list) {
    return (
      <div
        className="absolute bg-white rounded-md shadow-lg z-50"
        style={{ top: yPos, left: xPos }}
      >
        { list.name }
      </div>
    );
  }

  return <></>;
};
