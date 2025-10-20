import { useCallback, useMemo } from "react";
import { useMap } from "usehooks-ts";

export const useBreakpoints = () => {
  const [breakPoints, { set }] = useMap<number, boolean>();

  const setBreakPoint = useCallback(
    (address: number) => {
      set(address, true);
    },
    [set]
  );
  const clearBreakPoint = useCallback(
    (address: number) => {
      set(address, false);
    },
    [set]
  );
  const isBreakPointSet = useCallback(
    (address: number) => {
      return breakPoints.get(address) || false;
    },
    [breakPoints]
  );
  const toggleBreakPoint = useCallback(
    (address: number) => {
      if (isBreakPointSet(address)) {
        clearBreakPoint(address);
      } else {
        setBreakPoint(address);
      }
    },
    [isBreakPointSet, setBreakPoint, clearBreakPoint]
  );

  return useMemo(
    () => ({
      breakPoints,
      setBreakPoint,
      clearBreakPoint,
      isBreakPointSet,
      toggleBreakPoint,
    }),
    [
      breakPoints,
      setBreakPoint,
      clearBreakPoint,
      isBreakPointSet,
      toggleBreakPoint,
    ]
  );
};
