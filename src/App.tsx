import { useRoutes } from "react-router-dom";
import { GanttPage } from "./components/GanttPage";
import { MainLayout } from "./layout/MainLayout";
import { TasksLayout } from "./layout/TasksLayout";
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
  ]
}];


const App = () => {
  const rootStore = createStore();
  const routing = useRoutes(routes);

  if (!rootStore) return null;

  return (
    <StoreProvider value={rootStore}>
      {routing}
    </StoreProvider>
  );
};

export default App;
