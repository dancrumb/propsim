import { Box, Text } from "ink";
import React from "react";
import type { Cog } from "../chip/Cog.js";
import { b32, h16, h32, h8 } from "../utils/val-display.js";

type ValueAtCursorProps = {
  cog: Cog;
  address: number;
};

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box flexDirection="row">
      <Box minWidth={8}>
        <Text>{label}</Text>
      </Box>
      <Box>
        <Text> {value}</Text>
      </Box>
    </Box>
  );
}

export function ValueAtCursor({ cog, address }: ValueAtCursorProps) {
  const value = cog.readRegister(address) >>> 0;
  const words = [value & 0xffff, (value >>> 16) & 0xffff];
  const bytes = [
    value & 0xff,
    (value >>> 8) & 0xff,
    (value >>> 16) & 0xff,
    (value >>> 24) & 0xff,
  ];
  return (
    <Box
      borderStyle={"single"}
      minHeight={4}
      minWidth={20}
      paddingX={1}
      flexDirection="column"
    >
      <Row label="Address:" value={h16(address)} />

      <Row label="Hex:" value={`0x${h32(value)}`} />
      <Row label="Dec:" value={value} />
      <Row label="Bin:" value={`0b${b32(value)}`} />
      <Row
        label="Words:"
        value={words
          .map((w) => `0x${h16(w)} (${w.toString().padStart(5, " ")})`)
          .join(", ")}
      />
      <Row
        label="Bytes:"
        value={bytes
          .map((b) => `0x${h8(b)} (${b.toString().padStart(3, " ")})`)
          .join(", ")}
      />
    </Box>
  );
}
