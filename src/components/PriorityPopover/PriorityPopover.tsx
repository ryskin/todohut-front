import { FlagIcon } from "@heroicons/react/solid";
import { observer } from "mobx-react-lite";
import { useStore } from "../../models/StoreContext";
import { Task } from "../../models/Task/TaskModel";
import { Popover } from "../Popover";

type PrioritiesColors = {
  [key in Task["priority"]]: string;
};

const prioritiesColors: PrioritiesColors = {
  none: "text-gray-100",
  low: "text-gray-500",
  medium: "text-blue-500",
  high: "text-yellow-500",
  urgent: "text-red-500",
};


export const PriorityPopover = observer(({ taskId }: { taskId: string }) => {
  const store = useStore();
  const task = store.task.items.find((task) => task.id === taskId);

  const PriorityItem = ({
    priority,
    // onClick,
    flagSize = 4,
  }: {
    priority: Task["priority"];
    // onClick?: (taskId: string, priority: Task["priority"]) => void;
    flagSize?: number;
  }) => {
    return <FlagIcon className={`${prioritiesColors[priority]} h-${flagSize} w-{flagSize}`} />;
  };  

  const handleFlagClick = (priority: Task["priority"]) => () => {
    console.log("handleFlagClick", priority, task);
    task?.setPriority(priority);
  };

  const priorities = Object.keys(prioritiesColors) as Task["priority"][];
  if (!task) return null;
  return (
    <Popover
      clickComponent={<PriorityItem priority={task?.priority || "none"} />}
    >
      <div className="flex flex-col gap-1 p-2">
        {priorities.map((priorityName) => {
          return (
            <div key={priorityName} onClick={handleFlagClick(priorityName)} className="flex items-center p-1  cursor-pointer hover:bg-gray-50">
              <PriorityItem priority={priorityName} flagSize={6} />
              <div className="text-xs">{priorityName}</div>
            </div>
          );
        })}
      </div>
    </Popover>
  );
});
