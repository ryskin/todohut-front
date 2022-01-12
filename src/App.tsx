import { Route, useRoutes } from "react-router-dom";
import { ToDoTable } from "./components/ToDoTable";
import { MainLayout } from "./layout/MainLayout";
import { createStore } from "./models/RootStore";
import { StoreProvider, useStore } from "./models/StoreContext";
import "./tailwind.css";

const routes = [{
  element: <MainLayout />,
  path: "/",
  children: [
    {
      element: <ToDoTable />,
    }
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
