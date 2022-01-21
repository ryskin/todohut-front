import { useRoutes } from "react-router-dom";
import { GanttPage } from "./components/GanttPage";
import { UsersPage } from "./pages/UsersPage";
import { MainLayout } from "./layout/MainLayout";
import { TasksLayout } from "./pages/TasksPage";
import { createStore } from "./models/RootStore";
import { StoreProvider } from "./models/StoreContext";
import "./tailwind.css";

const routes = [{
  element: <MainLayout />,
  path: "/",
  children: [
    {
      element: <TasksLayout />,
      path: "/",
    },
    {
      element: <GanttPage />,
      path: "/gantt",
    },
  {
    element: <UsersPage />,
    path: "/users",
  },
  ]
}];


export const App = () => {
  const rootStore = createStore();
  const routing = useRoutes(routes);

  if (!rootStore) return null;

  return (
    <StoreProvider value={rootStore}>
      {routing}
    </StoreProvider>
  );
};
