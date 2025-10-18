import { Box, Text, useInput } from "ink";
import { useObservableState } from "observable-hooks";
import React from "react";
import { map } from "rxjs";
import { Cog } from "../chip/Cog.js";
import { decodeOpcode } from "../opcodes/decodeOpcode.js";
import { renderOperation } from "../opcodes/OperationStructure.js";
import CogFlagsDisplay from "./CogFlagsDisplay.js";
import RamDisplay from "./RamDisplay.js";

export default function CogDisplay({
  cog,
  hidden = false,
}: {
  cog: Cog;
  hidden?: boolean;
}) {
  const cogRam = cog.getRam();
  const isRunning = useObservableState(cog.running$, cog.isRunning());
  const pc = useObservableState(cog.pc$, 0);
  const readAhead = useObservableState(cog.readAhead$, 0);
  const [selected, setSelected] = React.useState(0);
  const size = 16;

  const currentInstructionValue = useObservableState(
    cog.pc$.pipe(map((pc) => cog.readRegister(pc) >>> 0))
  );

  useInput((_input, key) => {
    if (key.downArrow) {
      setSelected((s) => Math.min(s + 1, size - 1));
    } else if (key.upArrow) {
      setSelected((s) => Math.max(s - 1, 0));
    }
  });

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
      <Box flexDirection="row" width={"100%"}>
        <Box>
          <RamDisplay
            ram={cogRam}
            size={size}
            pc={pc}
            readAhead={readAhead}
            selected={selected}
          />
        </Box>
        <Box flexDirection="column" gap={2}>
          <Box>
            <Text>Running? {isRunning ? "Yes" : "No"}</Text>
          </Box>
          <Box>
            <Text>
              Current Operation:{" "}
              {currentInstructionValue
                ? renderOperation(decodeOpcode(currentInstructionValue))
                : "NONE"}
            </Text>
          </Box>

          <Box>
            <CogFlagsDisplay cog={cog} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
