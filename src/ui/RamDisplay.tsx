import { Box, measureElement, Text, type DOMElement } from "ink";
import React, { useRef, useState, type ReactElement } from "react";
import type { CogRam } from "../chip/CogRam.js";

const Pointers = ({
  pc,
  readAhead,
  i,
}: {
  pc: number;
  readAhead: number;
  i: number;
}) => {
  const arrowColor =
    pc === readAhead && i === pc
      ? "magentaBright"
      : i === pc
      ? "redBright"
      : i === readAhead
      ? "blue"
      : undefined;

  return (
    <Box width={3} height={1} paddingRight={1}>
      {arrowColor && <Text backgroundColor={arrowColor}> &gt;</Text>}
    </Box>
  );
};

export default function RamDisplay({
  ram,
  pc,
  readAhead,
  selected = 0,
}: {
  ram: CogRam;
  pc: number;
  readAhead: number;
  selected?: number;
}) {
  const [currentOffset, setCurrentOffset] = React.useState(0);
  const [ramHeight, setRamHeight] = useState(32);
  const rows: ReactElement[] = [];
  const ref = useRef<DOMElement | null>(null);

  React.useEffect(() => {
    const boundingRect = ref.current ? measureElement(ref.current) : null;
    setRamHeight(Math.max(boundingRect?.height ?? 0, 2));
  });

  React.useEffect(() => {
    setCurrentOffset((offset) => {
      if (selected < offset) {
        return Math.max(0, selected - ramHeight / 2);
      } else if (selected > offset + ramHeight - 1) {
        return offset + 1;
      }
      return offset;
    });
  }, [selected, ramHeight]);

  for (let i = currentOffset; i < currentOffset + ramHeight; i += 1) {
    rows.push(
      <Box key={i} flexDirection="row" height="100%">
        <Pointers i={i} pc={pc} readAhead={readAhead} />
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
              {ram.readRegister(i).toString(16).toUpperCase().padStart(8, "0")}
            </Text>
          </Box>
        </Box>
      </Box>
    );
  }
  return (
    <Box
      ref={ref}
      flexDirection="column"
      paddingX={1}
      height={"100%"}
      overflow="hidden"
      minWidth={28}
    >
      {rows}
    </Box>
  );
}
