import React, { type ReactElement } from "react";
import { Box, Text } from "ink";
import type { CogRam } from "../chip/CogRam.js";

export default function RamDisplay({
  ram,
  size = 16,
  pc,
  selected = 0,
}: {
  ram: CogRam;
  size?: number;
  pc: number;
  selected?: number;
}) {
  const [currentOffset, setCurrentOffset] = React.useState(0);
  const rows: ReactElement[] = [];

  React.useEffect(() => {
    if (pc < currentOffset) {
      setCurrentOffset(pc);
    } else if (pc >= currentOffset + size) {
      setCurrentOffset(pc - size + 1);
    }
  }, [pc, currentOffset, size]);

  for (let i = currentOffset; i < currentOffset + size; i += 1) {
    rows.push(
      <Box key={i} flexDirection="row">
        <Box
          key={i}
          flexDirection="row"
          backgroundColor={selected === i ? "cyanBright" : undefined}
        >
          <Box width={4}>
            <Text>{i.toString(16).toUpperCase().padStart(4, "0")}</Text>
          </Box>
          <Box width={2} alignItems="flex-start">
            <Text>:</Text>
          </Box>
          <Box width={8}>
            <Text>
              {ram.readURegister(i).toString(16).toUpperCase().padStart(8, "0")}
            </Text>
          </Box>
        </Box>
        <Box>{i === pc && <Text color="red"> &lt;-- PC</Text>}</Box>
      </Box>
    );
  }
  return (
    <Box flexDirection="column" paddingX={1} height={"100%"} overflow="hidden">
      {rows}
    </Box>
  );
}
