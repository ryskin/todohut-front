import { PlayIcon, StopIcon } from "@heroicons/react/solid";
import { useEffect } from "react";
import { useTimer } from "../../hooks/useTimer";
import { secondsToHHMMSS } from "../../utils/basic";

type TimerProps = {
  currentTimer: number;
  handleStop: () => void;
  handleStart: () => void;
  active: boolean;
  id: string;
};

export const Timer = ({ currentTimer, handleStop, handleStart, active, id }: TimerProps) => {
  const [counter, start, pause, , status] = useTimer(currentTimer, active);

  useEffect(() => {
    if (status === "start" && !active) {
      pause();
    }
  }, [active, pause, status]);


  const onClickStart = () => {    
    start();
    handleStart();
  };

  const onClickStop = () => {
    pause();
    handleStop();
  };

  return (
    <div className="flex items-center text-xs gap-0.5">
      {(status === "pause" || status === "pause" || status === "stop") && (
        <PlayIcon
          onClick={onClickStart}
          className="w-4 h-4 text-green-400 cursor-pointer"
        />
      )}
      {status === "start" && (
        <StopIcon
          onClick={onClickStop}
          className="w-4 h-4 text-red-400 cursor-pointer"
        />
      )}
      {secondsToHHMMSS(Number(counter)) || "00:00:00"}
    </div>
  );
};
