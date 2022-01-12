import { useCallback, useEffect, useRef, useState } from "react";

export const useTimer = (
  current: number,
  active: boolean
): [number, () => void, () => boolean, () => void, string] => {
  const [counter, setCounter] = useState(current);
  const [startCount, setStartCount] = useState(false);
  const [status, setStatus] = useState("stop");
  const [startTime, setStartTime] = useState(new Date());

  useEffect(() => {
    setCounter(current);
  }, [current]);

  useEffect(() => {
    if (active) {
      setStartCount(true);
      setStatus("start");
    }
  }, [active]);

  const intervalId = useRef<NodeJS.Timer>();
  const start: () => void = () => {
    setStartCount(true);
    setStartTime(new Date());
    setStatus("start");
  };
  const pause: () => boolean = () => {
    setStartCount(false);
    setStatus("pause");
    return true;
  };

  const reset: () => void = () => {
    setCounter(0);
    setStartCount(false);
    setStatus("stop");
  };

  // get difference in a seconds between start and now
  const getDifference = useCallback(() => {
    const now = new Date();
    const diff = now.getTime() - startTime.getTime();
    return Math.round(diff / 1000);
  }, [startTime]);

  useEffect(() => {
    intervalId.current = setInterval(() => {
      startCount && setCounter((counter) => current + getDifference());
    }, 1000);

    return () => {
      if (intervalId.current) clearInterval(intervalId.current);
    };
  }, [startCount, counter, current, getDifference]);

  return [counter, start, pause, reset, status];
};
