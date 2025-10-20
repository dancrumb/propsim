import {
  Box,
  measureElement,
  Text,
  useFocus,
  useInput,
  type DOMElement,
} from "ink";
import React, { useRef, useState, type ReactElement } from "react";
import type { CogRam } from "../chip/CogRam.js";
import { useDialog } from "../DialogProvider.js";

const Pointers = ({
  pc,
  readAhead,
  i,
  breakpoint,
}: {
  pc: number;
  readAhead: number;
  i: number;
  breakpoint?: boolean;
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
    <Box width={3} height={1} paddingRight={1} flexDirection="row">
      <Box width={1}>{breakpoint && <Text color="red">●</Text>}</Box>
      <Box width={1}>
        {arrowColor && <Text backgroundColor={arrowColor}>&gt;</Text>}
      </Box>
    </Box>
  );
};

export default function RamDisplay({
  ram,
  pc,
  title,
  readAhead,
  breakpoints = new Set<number>(),
  hidden = false,
}: {
  ram: CogRam;
  pc: number;
  title?: string;
  readAhead: number;
  onChangeSelected?: (address: number) => void;
  hidden?: boolean;
  breakpoints?: Set<number>;
}) {
  const { isFocused } = useFocus({ isActive: !hidden, autoFocus: !hidden });

  const [selected, setSelected] = React.useState(0);
  const [currentOffset, setCurrentOffset] = React.useState(0);
  const [ramHeight, setRamHeight] = useState(32);
  const rows: ReactElement[] = [];
  const ref = useRef<DOMElement | null>(null);

  const { openDialog, dialogIsOpen } = useDialog();

  useInput(
    (input, key) => {
      if (key.downArrow) {
        setSelected((s) => Math.min(s + 1, 1024));
      } else if (key.upArrow) {
        if (key.shift) {
          setSelected(0);
          return;
        }
        setSelected((s) => Math.max(s - 1, 0));
      } else if (input === "P") {
        setSelected(pc);
      } else if (input === "G") {
        openDialog("GoTo", (address) => {
          process.stderr.write(`Going to address: ${address}\n`);
          setSelected(address);
        });
      }
    },
    { isActive: !(hidden || dialogIsOpen) && isFocused }
  );

  React.useEffect(() => {
    const boundingRect = ref.current ? measureElement(ref.current) : null;
    setRamHeight(Math.max(boundingRect?.height ?? 2, 2) - 1);
  });

  React.useEffect(() => {
    const targetOffset = selected - Math.floor(ramHeight / 2);
    setCurrentOffset(Math.min(Math.max(targetOffset, 0), 1024 - ramHeight));
  }, [selected, ramHeight]);

  for (let i = currentOffset; i < currentOffset + ramHeight; i += 1) {
    rows.push(
      <Box key={i} flexDirection="row" height="100%">
        <Pointers
          i={i}
          pc={pc}
          readAhead={readAhead}
          breakpoint={breakpoints.has(i)}
        />
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
      height={"100%"}
      borderStyle={"round"}
      borderColor={isFocused ? "green" : "gray"}
      flexDirection="column"
      minWidth={30}
      alignItems="center"
      justifyContent="center"
    >
      <Box paddingBottom={1}>
        <Text>{title}</Text>
      </Box>
      <Box
        flexDirection="column"
        height={"100%"}
        overflow="hidden"
        width={"100%"}
      >
        {rows}
      </Box>
    </Box>
  );
}
