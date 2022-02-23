import { useRoutes } from "react-router-dom";
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

const routes = [
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

export const App = () => {
  const rootStore = createStore();
  const routing = useRoutes(routes);

  if (!rootStore) return null;

  return (
    <StoreProvider value={rootStore}>
      <DndProvider backend={HTML5Backend}>{routing}</DndProvider>
    </StoreProvider>
  );
};
