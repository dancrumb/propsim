import { useObservableState } from "observable-hooks";
import { Box, Text } from "ink";
import React from "react";
import { SystemClock } from "../chip/SystemClock.js";
import { h16 } from "../utils/val-display.js";

export default function SystemClockDisplay({
  systemClock,
}: {
  systemClock: SystemClock;
}) {
  const currentTick = useObservableState(
    systemClock.tick$,
    systemClock.getTicks()
  );

  return (
    <Box flexDirection="column" width={"100%"} alignItems="center" paddingX={1}>
      <Box
        justifyContent="center"
        alignItems="center"
        width={"100%"}
        borderStyle={"single"}
      >
        <Text>{h16(currentTick)}</Text>
      </Box>
      <Box paddingRight={1}>
        <Text>CLCK</Text>
      </Box>
    </Box>
  );
}
