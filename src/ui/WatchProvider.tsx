import React, {
  createContext,
  useCallback,
  useMemo,
  type PropsWithChildren,
} from "react";
import { useMap } from "usehooks-ts";
import type { Watch } from "./Watch.js";

const watchContext = createContext<void>(void 0);

const { Provider } = watchContext;

export const WatchProvider = ({ children }: PropsWithChildren<{}>) => {
  return <Provider value={void 0}>{children}</Provider>;
};

export const useWatches = () => {
  const [watches, actions] = useMap<Watch["id"], Watch>(new Map());
  const [lastWatchId, setLastWatchId] = React.useState(1);

  const addWatch = useCallback(
    (watch: Omit<Watch, "id">) => {
      const watchWithId = { ...watch, id: lastWatchId + 1 };
      setLastWatchId((id) => id + 1);
      actions.set(watchWithId.id, watchWithId);
    },
    [lastWatchId]
  );

  const removeWatch = useCallback((watchOrId: Watch | Watch["id"]) => {
    const id = typeof watchOrId === "number" ? watchOrId : watchOrId.id;
    actions.remove(id);
  }, [actions]);

  const watchList = useMemo(() => {
    return Array.from(watches.values());
  }, [watches]);

  return { watches: watchList, addWatch, removeWatch };
};
