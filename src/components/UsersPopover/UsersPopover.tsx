import { UserIcon } from "@heroicons/react/outline";
import { observer } from "mobx-react-lite";
import { useStore } from "../../models/StoreContext";
import { colorsFromText, getIdealTextColor } from "../../utils/basic";

import { Popover } from "../Popover";

type UserItemProps = {
  id: string;
  email: string;
  name: string;
  initials: string;
  handleClick: (id: string) => void;
};

const UserItem = ({
  id,
  name,
  email,
  initials,
  handleClick,
}: UserItemProps) => {
  const handleClickUser = () => {
    handleClick(id);
  };

  const bgColor = colorsFromText(initials);
  const textColor = getIdealTextColor(bgColor);

  return (
    <div
      onClick={handleClickUser}
      className="flex items-center pl-2 pb-2 pt-2 cursor-pointer hover:bg-gray-100"
    >
      <div
        className={`${textColor} flex justify-center bg-yellow-300 items-center rounded-full w-8 h-8 font-semibold`}
        style={{ backgroundColor: bgColor }}
      >
        <div>{initials}</div>
      </div>
      <div className="w-3" />
      <div>
        <div className="font-semibold">{name}</div>
        <div className="text-xs">{email}</div>
      </div>
    </div>
  );
};

const CreateUserLink = () => {
  return (
    <div className="flex items-center pl-2 pb-2 pt-2 cursor-pointer hover:bg-gray-100">
      <div>
        <div className="font-semibold">Add user</div>
      </div>
    </div>
  );
};

export const UsersPopover = observer(({ taskId }: { taskId: string }) => {
  const store = useStore();
  const users = store.user.items;
  const task = store.task.findById(taskId);

  const assignUserToTask = (userId: string) => {
    task?.assignUser(userId);
  };

  return (
    <Popover
      clickComponent={
        <div className="z-0 flex justify-center text-gray-300 border border-dashed border-gray-300 items-center rounded-full w-6 h-6">
          <UserIcon className="w-4 h-4 overflow-hidden " />
        </div>
      }
    >
      <div className="w-56 flex flex-col">
        <input
          placeholder="Search"
          className="placeholder:text-gray-300 divide-y border border-gray-200 rounded-md text-base p-2 h-8"
          type="text"
        />
        <div className="h-2 border-b border-gray-50 p-0"></div>
        <div className="flex flex-col divide-y">
          {users?.map((user) => (
            <UserItem
              key={user.email}
              id={user.id}
              name={user.name}
              email={user.email}
              initials={user.initials}
              handleClick={assignUserToTask}
            />
          ))}
        </div>
        <CreateUserLink />
      </div>
    </Popover>
  );
});
