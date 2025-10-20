import { Box, Text, useFocus } from "ink";
import React from "react";
import type { Cog } from "../chip/Cog.js";

export function WatchPanel({
  cog,
  hidden = false,
}: {
  cog: Cog;
  hidden?: boolean;
}) {
  const { isFocused } = useFocus({ isActive: !hidden });

  return (
    <Box
      borderStyle="round"
      borderColor={isFocused ? "green" : "gray"}
      flexDirection="column"
      width={30}
      height={10}
      alignItems="center"
    >
      <Box paddingBottom={1}>
        <Text>Watch</Text>
      </Box>
      <Box height="100%" flexDirection="column" justifyContent="center">
        <Text>(not implemented)</Text>
      </Box>
    </Box>
  );
}
