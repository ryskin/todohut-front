import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useState } from "react";
import { Timer } from "../../components/Timer/Timer";
import { useStore } from "../../models/StoreContext";

export const TimerCell = observer(({ taskId }: { taskId: string }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [active, setActive] = useState(false);
  const store = useStore();

  useEffect(() => {
    const duration = store.timeLog.taskDuration(taskId) / 1000;
    setCurrentTime(duration);
  },[currentTime, store.timeLog, taskId]);

  useEffect(() => {
    store.timeLog.currentTimer?.task.id === taskId  && setActive(true);
    store.timeLog.currentTimer?.task.id !== taskId  && setActive(false);
  }, [store.timeLog.currentTimer, taskId]);

  const handleStart = () => {
    const time = store.timeLog?.start({ taskId });
    setCurrentTime(time);
  };

  const handleStop = () => {
    const time = store.timeLog?.stop({ taskId });
    setCurrentTime(time || 0);
  };

  return (
    <Timer
      currentTimer={currentTime}
      handleStop={handleStop}
      handleStart={handleStart}
      active={active}
    />
  );
});
