import { Box, Newline, Text } from "ink";
import { useObservableState } from "observable-hooks";
import React from "react";
import type { Propeller } from "../chip/Propeller.js";

export default function WallClockDisplay({
  propeller,
}: {
  propeller: Propeller;
}) {
  const currentTick = useObservableState(
    propeller.systemClock.tick$,
    propeller.systemClock.getTicks()
  );

  const nSeconds = (currentTick * 1_000_000_000) / propeller.clockFrequency;
  const uSeconds = Math.trunc(nSeconds / 1000);
  const mSeconds = Math.trunc(nSeconds / 1_000_000);
  const seconds = Math.trunc(nSeconds / 1_000_000_000);

  return (
    <Box flexDirection="column" width={"100%"} alignItems="center" paddingX={1}>
      <Box
        justifyContent="center"
        alignItems="center"
        width={"100%"}
        borderStyle={"single"}
      >
        <Text>
          {Number(seconds).toFixed(1)}s <Newline />
          {Number(mSeconds - seconds * 1_000).toFixed(1)}ms <Newline />
          {Number(uSeconds - mSeconds * 1000).toFixed(1)}us <Newline />
          {Number(nSeconds - uSeconds * 1000).toFixed(1)}ns
        </Text>
      </Box>
      <Box paddingRight={1}>
        <Text>TIME</Text>
      </Box>
    </Box>
  );
}
