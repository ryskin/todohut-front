import { UserIcon, ViewListIcon } from "@heroicons/react/outline";
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";

export const MainLayout = () => {
  return (
    <div className="flex flex-row min-h-screen bg-gray-100">
      <div className="flex flex-col justify-between items-center w-16 p-4 bg-gray-200">
        <div className="flex flex-col space-y-2 gap-2 items-center">
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
