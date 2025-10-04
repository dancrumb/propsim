import React from "react";
import { Box, Text } from "ink";
import type { Cog } from "../chip/Cog.js";
import { useObservableState } from "observable-hooks";

export default function RunControl({ cog }: { cog: Cog }) {
  const { Z, C } = useObservableState(cog.flags$, { Z: false, C: false });

  return (
    <Box flexDirection="row">
      <Box
        borderStyle={"round"}
        width={5}
        justifyContent="center"
        borderColor={Z ? "brightWhite" : "gray"}
      >
        <Text color={Z ? "brightWhite" : "gray"}>Z</Text>
      </Box>
      <Box
        borderStyle={"round"}
        width={5}
        justifyContent="center"
        borderColor={C ? "brightWhite" : "gray"}
      >
        <Text color={C ? "brightWhite" : "gray"}>C</Text>
      </Box>
    </Box>
  );
}
