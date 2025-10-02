import React from "react";
import { Box, Text } from "ink";
import CogDisplay from "./CogDisplay.js";
import { CogRam } from "../CogRam.js";
import type { Cog } from "../Cog.js";

export default function CogsDisplay({
  currentCog,
  cogs,
}: {
  currentCog: number;
  cogs: Cog[];
}) {
  return (
    <Box flexDirection="column" margin={0} width={"100%"}>
      <Box margin={0}>
        {cogs.map((cog) => (
          <Box borderStyle="doubleSingle" height={3} paddingX={1}>
            <Text
              bold={currentCog === cog.id}
              color={currentCog === cog.id ? "blue" : "white"}
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
