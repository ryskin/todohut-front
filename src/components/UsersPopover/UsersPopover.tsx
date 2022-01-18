import { UserIcon } from "@heroicons/react/outline";
import { XIcon } from "@heroicons/react/solid";
import { isEmpty } from "lodash";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useStore } from "../../models/StoreContext";
import { User } from "../../models/User/UserModel";
import { colorsFromText, getIdealTextColor } from "../../utils/basic";

import { Popover } from "../Popover";

type UserItemProps = {
  id: string;
  email: string;
  name: string;
  initials: string;
  removeAssignee: (id: string) => void;
  handleClick: (id: string) => void;
};

const UserAvatar = ({
  initials,
  text,
  size,
  id,
  removeAssignee,
}: {
  initials?: string;
  text?: string;
  size?: number;
  id?: string;
  removeAssignee?: (id: string) => void;
}) => {
  const [showDelete, setShowDelete] = useState(false);
  const bgColor = !initials ? "bg-grey-300" : colorsFromText(initials);
  const textColor = getIdealTextColor(bgColor);
  const fontSize = size && size > 3 ? "xs" : "md";
  const handleShowDelete = (show: boolean) => () => {
    setShowDelete(show);
  };

  const handleRemoveAssignee = (event: any) => {
    event.stopPropagation();

    if (removeAssignee && id) {
      removeAssignee(id);
    }
  };


  return (
    <div
      className={`${textColor} ${showDelete ? 'z-50': ''} overflow-visible relative flex justify-center bg-gray-300 items-center rounded-full w-${
        size || 8
      } h-${size || 8} font-semibold stroke-slate-100 ring-2 ring-white`}
      style={{ backgroundColor: bgColor }}
      onMouseOver={handleShowDelete(true)}
      onMouseLeave={handleShowDelete(false)}
    >
      <div
        className={`text-${fontSize}`}
      >
        {text || initials}
      </div>
      {showDelete && (
        <div onClick={handleRemoveAssignee} onMouseOver={handleShowDelete(true)} className="absolute text-white bg-gray-600 flex text-xs w-3 h-3 rounded-full top-[-3px] right-0 ring-1 ring-white z-50 items-center justify-center">
          <XIcon/>
        </div>
      )}
    </div>
  );
};

const UserAvatarList = ({ users, size, removeAssignee }: { users: User[]; size?: number, removeAssignee: (id: string) => void  }) => {
  //filter users with same id
  const totalUsers = users.length;
  const slicedUsers = users.slice(0, 3);
  const renderUsers = slicedUsers.map((user) => (
    <div key={user.id} className="flex items-center justify-center">
      <UserAvatar removeAssignee={removeAssignee} id={user.id} initials={user.initials} size={6} />
    </div>
  ));
  if (totalUsers > 3)
    renderUsers.push(
      <UserAvatar text={`+${totalUsers - 3}`} size={size || 6} />
    );
  return <div className="flex overflow-visible -space-x-2">{renderUsers}</div>;
};

const UserItem = ({
  id,
  name,
  email,
  initials,
  handleClick,
  removeAssignee,
}: UserItemProps) => {
  const handleClickUser = () => {
    handleClick(id);
  };

  return (
    <div
      onClick={handleClickUser}
      className="flex items-center pl-2 pb-2 pt-2 cursor-pointer hover:bg-gray-100"
    >
      <UserAvatar removeAssignee={removeAssignee} initials={initials} />
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
  const assignees = task?.assignees;

  const assignUserToTask = (userId: string) => {
    task?.assignUser(userId);
  };

  const removeAssignee = (userId: string) => {
    task?.removeAssignedUser(userId);
  };

  return (
    <Popover
      clickComponent={
        <>
          {isEmpty(assignees) && (
            <div className="z-0 flex justify-center text-gray-300 border border-dashed border-gray-300 items-center rounded-full w-6 h-6">
              <UserIcon className="w-4 h-4 overflow-hidden" />
            </div>
          )}
          {!isEmpty(assignees) && <UserAvatarList removeAssignee={removeAssignee} users={assignees || []} />}
        </>
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
              removeAssignee={removeAssignee}
            />
          ))}
        </div>
        <CreateUserLink />
      </div>
    </Popover>
  );
});
