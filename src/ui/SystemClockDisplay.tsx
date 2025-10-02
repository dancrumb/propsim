import { useObservableState } from "observable-hooks";
import { Hub } from "../Hub.js";
import { Box, Text } from "ink";
import React from "react";
import { SystemClock } from "../SystemClock.js";

export default function SystemClockDisplay({
  systemClock,
}: {
  systemClock: SystemClock;
}) {
  const currentHub = useObservableState(
    systemClock.tick$,
    systemClock.getTicks()
  );

  return (
    <Box>
      <Text>Clock: {currentHub}</Text>
    </Box>
  );
}
