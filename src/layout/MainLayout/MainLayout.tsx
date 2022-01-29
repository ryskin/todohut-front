import { UserIcon, ViewListIcon } from "@heroicons/react/outline";
import { observer } from "mobx-react-lite";
import React from "react";
import { Link, Outlet } from "react-router-dom";
import { AddUserForm } from "../../components/AddUserForm";
import { Modal } from "../../components/Modal";
import { useStore } from "../../models/StoreContext";
import { UserSnapshot } from "../../models/User/UserModel";
import { NavLink } from "react-router-dom";

const AddUserModal = observer(
  ({ clickComponent }: { clickComponent: JSX.Element }) => {
    const store = useStore();

    const [closeModal, setCloseModal] = React.useState(false);

    const handleCreateUser = (user: UserSnapshot) => {
      store.user.add(user);
      setCloseModal((prev) => !prev);
    };

    const activeClassName = "bg-white ";

    return (
      <Modal
        title="Add user"
        clickComponent={clickComponent}
        closeFromParent={closeModal}
      >
        <AddUserForm handleCreate={handleCreateUser} />
      </Modal>
    );
  }
);

export const MainLayout = () => {
  return (
    <div className="flex flex-row min-h-screen bg-gray-100">
      <div className="flex flex-col justify-between items-center w-16 p-4 bg-gray-200">
        <div className="flex flex-col space-y-2 gap-2 items-center">
          {/* <AddUserModal
            clickComponent={
              <div className="cursor-pointer rounded-full bg-gray-200 w-8 h-8 flex justify-center items-center">
                <ViewListIcon className="w-5 h-5 text-gray-400" />
              </div>
            }
          /> */}
          <div className="cursor-pointer rounded-full w-10 h-10 flex justify-center items-center">
            <div className="space-y-2"></div>
            <NavLink to="/" className={({ isActive }) =>
              `${isActive ? "bg-white" : ""
              } cursor-pointer rounded-full w-8 h-8 flex justify-center items-center`
            }>
              <ViewListIcon className="w-6 h-6 text-gray-500" />
            </NavLink>
          </div>
          <NavLink
            className={({ isActive }) =>
              `${isActive ? "bg-white" : ""
              } cursor-pointer rounded-full w-8 h-8 flex justify-center items-center`
            }
            to="/users"
          >
            <div className="space-y-2"></div>
            <UserIcon className="w-6 h-6 text-gray-500" />
          </NavLink>
        </div>
        <div className="space-y-2">
          <div className="rounded-full bg-gray-200 w-8 h-8"></div>
          <div className="rounded-full bg-gray-200 w-8 h-8"></div>
          <div className="rounded-full bg-gray-200 w-8 h-8"></div>
        </div>
      </div>
      <Outlet />
    </div>
  );
};
