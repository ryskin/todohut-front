import { useParams } from "react-router-dom";

export const TaskView = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>{id}</h1>
    </div>
  );
};
