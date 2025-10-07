import React, { useRef } from "react";
import { Box, Text } from "ink";
import CogDisplay from "./CogDisplay.js";
import type { Cog } from "../chip/Cog.js";
import { combineLatest } from "rxjs";
import { useObservableEagerState } from "observable-hooks";

export default function CogsDisplay({
  currentCog,
  cogs,
}: {
  currentCog: number;
  cogs: Cog[];
}) {
  const prev = useRef(combineLatest(cogs.map((c) => c.running$)));

  const cogsStatuses = useObservableEagerState(prev.current);

  return (
    <Box flexDirection="column" margin={0} width={"100%"}>
      <Box margin={0}>
        {cogs.map((cog) => (
          <Box
            borderStyle="doubleSingle"
            height={3}
            paddingX={1}
            borderColor={`${cogsStatuses[cog.id] ? "green" : "red"}${
              currentCog === cog.id ? "Bright" : ""
            }`}
          >
            <Text
              bold={currentCog === cog.id}
              color={currentCog === cog.id ? "brightWhite" : "grey"}
            >
              {cog.id}
            </Text>
          </Box>
        ))}
      </Box>
      {cogs.map((cog) => (
        <CogDisplay cog={cog} key={cog.id} hidden={currentCog !== cog.id} />
      ))}
    </Box>
  );
}
