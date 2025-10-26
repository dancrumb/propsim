import { Box, Text, useInput } from "ink";
import { useObservableState } from "observable-hooks";
import React, { useCallback, useEffect } from "react";
import { map } from "rxjs";
import { Cog } from "../chip/Cog.js";
import { CogInfo } from "./CogInfo.js";
import { EventBus } from "./EventBus.js";
import RamDisplay from "./RamDisplay.js";
import { useBreakpoints } from "./useBreakpoints.js";
import { WatchPanel } from "./WatchPanel.js";

const eventBus = EventBus.getInstance();

export default function CogDisplay({
  cog,
  hidden = false,
}: {
  cog: Cog;
  hidden?: boolean;
}) {
  const { breakPoints, toggleBreakPoint, isBreakPointSet } = useBreakpoints();

  const cogRam = cog.getRam();
  const isRunning = useObservableState(cog.running$, cog.isRunning());
  const pc = useObservableState(cog.pc$, 0);
  const readAhead = useObservableState(cog.readAhead$, 0);
  const [selected, setSelected] = React.useState(0);

  const currentInstructionValue = useObservableState(
    cog.pc$.pipe(map((pc) => cog.readRegister(pc) >>> 0))
  );

  useEffect(() => {
    if (isBreakPointSet(pc)) {
      eventBus.emitEvent("stopSimulation");
    }
  }, [pc]);

  const onChangeSelected = useCallback((address: number) => {
    setSelected(address);
  }, []);

  useInput(
    (input) => {
      if (input === " ") {
        toggleBreakPoint(selected);
      }
    },
    { isActive: !hidden }
  );

  process.stderr.write(
    `Breakpoints for Cog ${cog.id}: ${Array.from(breakPoints.entries())
      .filter(([, isSet]) => isSet)
      .map(([addr]) => addr)
      .join(", ")}\n`
  );

  return (
    <Box
      margin={0}
      borderStyle={"double"}
      display={hidden ? "none" : "flex"}
      width="100%"
      flexDirection="column"
      height="100%"
    >
      <Box
        flexDirection="row"
        justifyContent="center"
        width={"100%"}
        backgroundColor={"blue"}
        alignItems="center"
      >
        <Box>
          <Text color={"white"}>Cog {cog.id}</Text>
        </Box>
      </Box>
      <Box flexDirection="row" width={"100%"} height={"100%"}>
        <Box>
          <RamDisplay
            title={`Cog RAM`}
            ram={cogRam}
            pc={pc}
            readAhead={readAhead}
            onChangeSelected={onChangeSelected}
            hidden={hidden}
            breakpoints={
              new Set(
                Array.from(breakPoints.entries())
                  .filter(([, isSet]) => isSet)
                  .map(([addr]) => addr)
              )
            }
          />
        </Box>
        <Box
          flexDirection="column"
          gap={1}
          borderStyle={"round"}
          borderColor={"grey"}
        >
          <CogInfo
            currentInstructionValue={currentInstructionValue}
            isRunning={isRunning}
            cog={cog}
            selected={selected}
          />
        </Box>
        <Box>
          <WatchPanel cog={cog} hidden={hidden} />
        </Box>
      </Box>
    </Box>
  );
}
