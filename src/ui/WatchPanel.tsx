import { Box, Text, useFocus, useInput } from "ink";
import React from "react";
import type { Cog } from "../chip/Cog.js";
import { useDialog } from "../DialogProvider.js";
import { inkLog } from "../ink-log.js";
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
  const { openDialog, dialogIsOpen } = useDialog();

  useInput(
    (input) => {
      if (input === "+") {
        openDialog("AddWatch", (watchString: string) => {
          inkLog(`Adding watch: ${watchString}`);
        });
        inkLog("Adding watch (not implemented)");
      }
    },
    { isActive: isFocused && !dialogIsOpen }
  );

  return (
    <Box
      borderStyle="round"
      borderColor={isFocused ? "green" : "gray"}
      flexDirection="column"
      alignItems="center"
      flexGrow={1}
    >
      <Box paddingBottom={1}>
        <Text>Watch</Text>
      </Box>
      <Box height="95%" flexDirection="column" justifyContent="center">
        {watches.map((watch) => (
          <Box key={watch.watchId} flexDirection="row" alignItems="center">
            <Text>{watch.watchId}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
