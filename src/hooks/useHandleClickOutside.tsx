import React, { useEffect, useRef } from "react";

type UseHandleClickOutsideReturn = {
  ref: React.RefObject<HTMLDivElement>;
};

export const useHandleClickOutside = (
  callback: (...args: any[]) => void
): UseHandleClickOutsideReturn => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as HTMLDivElement)
      ) {
        callback.apply(null, [false]);
      }
    };

    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [callback]);

  return { ref };
}
