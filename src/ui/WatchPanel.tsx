import { Box, Text, useFocus, useInput } from "ink";
import React, { useEffect } from "react";
import type { Subscription } from "rxjs";
import { useMap } from "usehooks-ts";
import type { Cog } from "../chip/Cog.js";
import { useDialog } from "../DialogProvider.js";
import { WatchLocation } from "../ObservableBuffer.js";
import type { Watch } from "./Watch.js";
import { WatchEntry } from "./WatchEntry.js";
import { useWatches } from "./WatchProvider.js";

export function WatchPanel({
  cog,
  hidden = false,
}: {
  cog: Cog;
  hidden?: boolean;
}) {
  const { isFocused } = useFocus({ isActive: !hidden });
  const { watches, addWatch, removeWatch } = useWatches();
  const [watchData, actions] = useMap<Watch["id"], any>(new Map());
  const { openDialog, dialogIsOpen } = useDialog();

  useInput(
    (input) => {
      if (input === "+") {
        openDialog("AddWatch", (watch: Omit<Watch, "id">) => {
          addWatch(watch);
        });
      }
    },
    { isActive: isFocused && !dialogIsOpen }
  );

  useEffect(() => {
    const subscriptions: Subscription[] = [];

    for (const watch of watches) {
      const ram =
        watch.location === WatchLocation.Main
          ? cog.hub.mainRamReader
          : cog.getRam();

      const sub = ram
        .watch(watch.from, watch.to, watch.as.toLowerCase() as any)
        .subscribe({
          next: ({ data }) => {
            actions.set(watch.id, data);
          },
        });
      subscriptions.push(sub);
    }

    return () => {
      for (const sub of subscriptions) {
        sub.unsubscribe();
      }
    };
  }, [watches, cog]);

  return (
    <Box
      borderStyle="round"
      borderColor={isFocused ? "green" : "gray"}
      flexDirection="column"
      alignItems="center"
      flexGrow={1}
      overflowY="hidden"
    >
      <Box paddingBottom={1}>
        <Text>Watch</Text>
      </Box>
      <Box
        height="95%"
        flexDirection="column"
        justifyContent="flex-start"
        gap={1}
        width="100%"
      >
        {watches.map((watch) => (
          <WatchEntry
            key={watch.id}
            watch={watch}
            data={watchData.get(watch.id) || []}
          />
        ))}
      </Box>
    </Box>
  );
}
