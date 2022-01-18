import { ClockIcon } from "@heroicons/react/outline";
import { observer } from "mobx-react-lite";
import { useStore } from "../../models/StoreContext";
import { secondsToHHMM } from "../../utils/basic";
import { Popover } from "../Popover";
import { TimeInput } from "../TimeInput/TimeInput";

export const TimeEstimateCell = observer(({ taskId, value }: { taskId: string, value: string }) => {
  const store = useStore();
  const task = store.task.findById(taskId);
  const seconds = task?.timeEstimate ?? 0;

  return (
    <div className="flex justify-center">
      <Popover
        clickComponent={
          <div className="flex items-center">
            <ClockIcon className="w-4 h-4 text-gray-400 cursor-pointer" />{" "}
            <div className="mr-0.5"></div>
            <div className="text-gray-500 text-xs">{secondsToHHMM(Number(value)) || ""}</div>
          </div>
        }
      >
        <div className="flex flex-col">
          <TimeInput seconds={seconds} onChange={(v: number) => task?.addTimeEstimate(v)} />
        </div>
      </Popover>
    </div>
  )
});