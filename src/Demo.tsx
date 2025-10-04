import React, { useRef } from "react";
import { Box, Text, useStdout, useInput } from "ink";
import { SystemClock } from "./chip/SystemClock.js";
import { Hub } from "./chip/Hub.js";
import HubDisplay from "./ui/HubDisplay.js";
import SystemClockDisplay from "./ui/SystemClockDisplay.js";
import CogsDisplay from "./ui/CogsDisplay.js";
import { MainRam } from "./chip/MainRam.js";
import { Cog } from "./chip/Cog.js";
import { SystemCounter } from "./chip/SystemCounter.js";
import RunControl, { type RunSpeed } from "./ui/RunControl.js";

const systemClock = new SystemClock();
const systemCounter = new SystemCounter(systemClock);
const mainRam = new MainRam("./simple.binary");
const hub = new Hub(systemClock, 8, mainRam);
const cogs = Array.from(
  { length: 8 },
  (_, i) => new Cog(systemClock, hub, systemCounter, i)
);

cogs[0]?.start(0x18, 0x18);

export default function Demo() {
  const { stdout } = useStdout();
  const [currentCog, setCurrentCog] = React.useState(0);
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
        <Box flexDirection="column">
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
