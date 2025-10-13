import { Box, Text, useInput, useStdout } from "ink";
import React, { useRef } from "react";
import type { Cog } from "./chip/Cog.js";
import { Propeller } from "./chip/Propeller.js";
import CogsDisplay from "./ui/CogsDisplay.js";
import HubDisplay from "./ui/HubDisplay.js";
import RunControl, { type RunSpeed } from "./ui/RunControl.js";
import SystemClockDisplay from "./ui/SystemClockDisplay.js";

export default function Demo({ propeller }: { propeller: Propeller }) {
  const systemClock = propeller.systemClock;
  const hub = propeller.hub;
  const cogs: Array<Cog> = propeller.cogs;

  const { stdout } = useStdout();
  const [currentCog, setCurrentCog] = React.useState(
    Math.max(
      0,
      cogs.findIndex((c) => c.isRunning())
    )
  );
  const runningId = useRef<NodeJS.Timeout | null>(null);

  const handleRunControlChange = React.useCallback((state: RunSpeed) => {
    if (runningId.current) {
      clearInterval(runningId.current);
      runningId.current = null;
    }
    if (state !== "paused") {
      runningId.current = setInterval(
        () => {
          systemClock.stepForward(1);
        },
        state === "x1" ? 500 : 250
      );
    }
  }, []);

  useInput((input) => {
    if (input === "t") {
      systemClock.stepForward(1);
    } else if (["0", "1", "2", "3", "4", "5", "6", "7"].includes(input)) {
      setCurrentCog(parseInt(input, 10));
    }
  });

  return (
    <Box
      height={stdout.rows}
      width={stdout.columns}
      borderStyle={"double"}
      flexDirection="column"
      paddingX={1}
    >
      <Box flexDirection="row">
        <Box flexDirection="column" width={12} alignItems="center">
          <Box
            flexDirection="column"
            marginBottom={1}
            width={7}
            alignItems="center"
          >
            <HubDisplay hub={hub} />
            <Box>
              <Text>Hub</Text>
            </Box>
          </Box>
          <SystemClockDisplay systemClock={systemClock} />
        </Box>
        <CogsDisplay currentCog={currentCog} cogs={cogs} />
      </Box>
      <Box flexDirection="row" justifyContent="center" width={"100%"}>
        <RunControl onChangeState={handleRunControlChange} />
      </Box>
    </Box>
  );
}
