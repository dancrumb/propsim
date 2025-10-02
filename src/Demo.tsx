import React from "react";
import { Box, Text, useStdout, useInput } from "ink";
import { SystemClock } from "./SystemClock.js";
import { Hub } from "./Hub.js";
import HubDisplay from "./ui/HubDisplay.js";
import SystemClockDisplay from "./ui/SystemClockDisplay.js";
import CogsDisplay from "./ui/CogsDisplay.js";
import { MainRam } from "./MainRam.js";
import { Cog } from "./Cog.js";
import { SystemCounter } from "./SystemCounter.js";
import { Gpio } from "./Gpio.js";

const systemClock = new SystemClock();
const systemCounter = new SystemCounter(systemClock);
const mainRam = new MainRam("./test.bin");
const hub = new Hub(systemClock, 8, mainRam);
const cogs = Array.from(
  { length: 8 },
  (_, i) => new Cog(systemClock, hub, systemCounter, new Gpio(), i)
);

cogs[0]?.start(10, 0);

export default function Demo() {
  const { stdout } = useStdout();
  const [currentCog, setCurrentCog] = React.useState(0);

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
      flexDirection="row"
      paddingX={1}
    >
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
  );
}
