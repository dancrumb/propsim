import React from "react";
import { Box, Text } from "ink";
import type { CogRam } from "../CogRam.js";
import RamDisplay from "./RamDisplay.js";
import { Cog } from "../Cog.js";
import { useObservableState } from "observable-hooks";

export default function CogDisplay({
  cog,
  hidden = false,
}: {
  cog: Cog;
  hidden?: boolean;
}) {
  const cogRam = cog.getRam();
  const pc = useObservableState(cog.pc$, 0);
  return (
    <Box
      margin={0}
      borderStyle={"double"}
      display={hidden ? "none" : "flex"}
      width="100%"
      flexDirection="column"
    >
      <Box flexDirection="row" justifyContent="center" width={"100%"}>
        <Box>
          <Text>Cog {cog.id}</Text>
        </Box>
      </Box>
      <Box>
        <RamDisplay ram={cogRam} size={16} pc={pc} />
      </Box>
    </Box>
  );
}
