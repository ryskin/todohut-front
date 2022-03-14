import { useState } from "react";
import { useStore } from "../../models/StoreContext";

export const BudgetCell = ({ taskId }: { taskId: string }) => {
  const [editMode, setEditMode] = useState(false);
  const store = useStore();

  const task = store.task.findById(taskId);

  const onChange = (e: any) => {
    const value = e.target.value;
    task?.setBudget(Number(value));
  };


  if (
    !editMode && !task?.budget)
   {
    return (
      <div
        className="w-14"
        onMouseLeave={() => setEditMode(false)}
        onMouseEnter={() => setEditMode(true)}
      >
        -
      </div>
    );
  }
  return <input onChange={onChange} className="w-14 text-xs" value={task?.budget || 0} />;
};
