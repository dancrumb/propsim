import React, { Component, type ReactElement } from "react";
import { Box, Text, useInput } from "ink";
import type { CogRam } from "../CogRam.js";

export default function RamDisplay({
  ram,
  size = 16,
  pc,
}: {
  ram: CogRam;
  size?: number;
  pc: number;
}) {
  const [currentOffset, setCurrentOffset] = React.useState(0);
  const [selected, setSelected] = React.useState(0);
  const rows: ReactElement[] = [];

  useInput((input, key) => {
    if (key.downArrow) {
      setSelected((s) => Math.min(s + 1, size - 1));
    } else if (key.upArrow) {
      setSelected((s) => Math.max(s - 1, 0));
    }
  });

  for (let i = currentOffset; i < currentOffset + size; i += 1) {
    rows.push(
      <Box
        key={i}
        flexDirection="row"
        backgroundColor={selected === i ? "cyanBright" : undefined}
      >
        <Box width={6}>
          <Text>{i.toString(16).toUpperCase().padStart(4, "0")}</Text>
        </Box>
        <Box width={1}>
          <Text>:</Text>
        </Box>
        <Box width={20}>
          <Text>
            {ram.readURegister(i).toString(16).toUpperCase().padStart(8, "0")}
            {i === pc && <Text color="red"> &lt;-- PC</Text>}
          </Text>
        </Box>
      </Box>
    );
  }
  return <Box flexDirection="column">{rows}</Box>;
}
