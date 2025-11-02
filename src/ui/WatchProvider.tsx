import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type PropsWithChildren,
} from "react";
import { useMap } from "usehooks-ts";
import type { Watch } from "./Watch.js";

const watchContext = createContext<{
  watches: Watch[];
  addWatch: (watch: Omit<Watch, "id">) => void;
  removeWatch: (watchOrId: Watch | Watch["id"]) => void;
}>({ watches: [], addWatch: () => {}, removeWatch: () => {} });

const { Provider } = watchContext;

export const WatchProvider = ({ children }: PropsWithChildren<{}>) => {
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

  return (
    <Provider
      value={{
        watches: watchList,
        addWatch,
        removeWatch,
      }}
    >
      {children}
    </Provider>
  );
};

export const useWatches = () => {
  return useContext(watchContext);
};
