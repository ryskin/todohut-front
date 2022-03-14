import { Navigate, useLocation, useRoutes } from "react-router-dom";
import { GanttPage } from "./components/GanttPage";
import { UsersPage } from "./pages/UsersPage";
import { MainLayout } from "./layout/MainLayout";
import { TasksLayout } from "./pages/TasksPage";
import { createStore } from "./models/RootStore";
import { StoreProvider } from "./models/StoreContext";
import "./tailwind.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TaskViewPage } from "./pages/TaskViewPage";
import { AddUserModal } from "./components/AddUserModal/AddUserModal";
import { SignUpPage } from "./pages/SignUpPage";
import { Unauthorized } from "./layout/Unauthorized";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { RootStore } from "./models/RootStoreModel";

const routes = [
  {
    element: <Unauthorized />,
    path: "/unauthorized",
    children: [
      {
        element: <SignUpPage />,
        path: "/unauthorized/signup",
      }
    ],
  },
  {
    element: <MainLayout />,
    path: "/",
    children: [
      {
        element: <TasksLayout />,
        path: "/",
        children: [
          {
            path: "/tasks/:taskId",
            element: <TaskViewPage />,
          },
        ]
      },
      // {
      //   path: "/users/add",
      //   element: <AddUserModal />,
      // },
      // {
      //   path: "/tasks/:taskId",
      //   element: <TaskViewPage />,
      // },
      {
        element: <GanttPage />,
        path: "/gantt",
      },
      {
        element: <UsersPage />,
        path: "/users",
      },
    ],
  },
];

const setupRootStore = async () => {
  const rootStore = createStore();
  return rootStore;
}

export const App = observer(() => {
  const routing = useRoutes(routes);
  const { pathname } = useLocation();
  const [rootStore, setRootStore] = useState<RootStore | undefined>(undefined);

  useEffect(() => {
    setupRootStore().then((store) => {
      setRootStore(store);
    });
  }, []);

  if (!rootStore) return null;

  if (!rootStore?.user.currentUser && pathname === "/") {
    return <Navigate to="/unauthorized/signup" />;
  }

  return (
    <StoreProvider value={rootStore}>
      <DndProvider backend={HTML5Backend}>{routing}</DndProvider>
    </StoreProvider>
  );
});
