import { Box, Text } from "ink";
import React from "react";
import type { Cog } from "../chip/Cog.js";
import { decodeOpcode } from "../opcodes/decodeOpcode.js";
import { renderOperation } from "../opcodes/OperationStructure.js";
import CogFlagsDisplay from "./CogFlagsDisplay.js";
import { ValueAtCursor } from "./ValueAtCursor.js";

export function CogInfo({
  currentInstructionValue,
  isRunning,
  cog,
  selected,
}: {
  currentInstructionValue?: number;
  isRunning: boolean;
  cog: Cog;
  selected: number;
}) {
  return (
    <Box flexDirection="column">
      <Box height={10} flexDirection="column">
        <Box paddingLeft={1}>
          <Text>Running? {isRunning ? "Yes" : "No"}</Text>
        </Box>
        <Box paddingLeft={1}>
          <Text>
            Current Operation:{" "}
            {currentInstructionValue
              ? renderOperation(decodeOpcode(currentInstructionValue))
              : "NONE"}
          </Text>
        </Box>
      </Box>
      <Box height={10}>
        <CogFlagsDisplay cog={cog} />
      </Box>
      <ValueAtCursor cog={cog} address={selected} />
    </Box>
  );
}
