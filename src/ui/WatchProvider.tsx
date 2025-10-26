import React, {
  createContext,
  useCallback,
  type PropsWithChildren,
} from "react";
import type { Watch } from "../ObservableBuffer.js";

const watchContext = createContext<void>(void 0);

const { Provider } = watchContext;

export const WatchProvider = ({ children }: PropsWithChildren<{}>) => {
  return <Provider value={void 0}>{children}</Provider>;
};

export const useWatches = () => {
  const [watches, setWatches] = React.useState<Watch[]>([]);

  const addWatch = useCallback((watch: Watch) => {
    setWatches((prevWatches) => [...prevWatches, watch]);
  }, []);

  const removeWatch = useCallback((watch: Watch) => {
    setWatches((prevWatches) => prevWatches.filter((w) => w !== watch));
  }, []);

  return { watches, addWatch, removeWatch };
};
