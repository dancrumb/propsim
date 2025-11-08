import {
  Box,
  measureElement,
  Newline,
  Text,
  useFocus,
  useInput,
  type DOMElement,
} from "ink";
import React, { useEffect, useRef, useState, type ReactNode } from "react";
import type { MainRam } from "../chip/MainRam.js";
import { useDialog } from "../DialogProvider.js";
import { h16, h8 } from "../utils/val-display.js";

type MainRamDisplayProps = {
  ram: MainRam;
  hidden?: boolean;
};

export function MainRamDisplay({ ram, hidden }: MainRamDisplayProps) {
  const [currentOffset, setCurrentOffset] = React.useState(0);
  const [selected, setSelected] = React.useState(0);

  const { dialogIsOpen } = useDialog();
  const ref = useRef<DOMElement | null>(null);

  const { isFocused } = useFocus({ isActive: !hidden, autoFocus: !hidden });

  const [currentDisplay, setCurrentDisplay] = useState<number[]>([]);
  const [ramHeight, setRamHeight] = useState(32);

  useEffect(() => {
    const window$ = ram.watch(
      currentOffset,
      currentOffset + ramHeight * 16 - 65,
      "byte"
    );
    const subscription = window$.subscribe({
      next: (newDisplay) => {
        setCurrentDisplay(newDisplay.data);
      },
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [currentOffset, ramHeight]);

  React.useEffect(() => {
    const boundingRect = ref.current ? measureElement(ref.current) : null;
    setRamHeight(Math.max(boundingRect?.height ?? 2, 2) - 1);
  });

  React.useEffect(() => {
    const targetOffset = selected - Math.floor(ramHeight & 0xfffff0);

    setCurrentOffset(
      Math.min(Math.max(targetOffset, 0), ram.size - 1 - ramHeight) & 0xfffff0
    );
  }, [selected, ramHeight]);

  useInput(
    (_input, key) => {
      let changeSelection: number = 0;
      if (key.downArrow) {
        changeSelection = 16;
      } else if (key.upArrow) {
        changeSelection = -16;
      } else if (key.rightArrow) {
        changeSelection = +1;
      } else if (key.leftArrow) {
        changeSelection = -1;
      }

      if (key.shift) {
        changeSelection <<= 4;
      }
      setSelected((s) =>
        Math.min(ram.size - 1, Math.max(s + changeSelection, 0))
      );
    },
    { isActive: !(hidden || dialogIsOpen) && isFocused }
  );

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
        <Text>Main RAM Display</Text>
      </Box>
      <Box>
        <Text>{"     "}</Text>
        <Text>00 </Text>
        <Text>01 </Text>
        <Text>02 </Text>
        <Text>03 </Text>
        <Text>04 </Text>
        <Text>05 </Text>
        <Text>06 </Text>
        <Text>07 </Text>
        <Text>08 </Text>
        <Text>09 </Text>
        <Text>0a </Text>
        <Text>0b </Text>
        <Text>0c </Text>
        <Text>0d </Text>
        <Text>0e </Text>
        <Text>0f </Text>
      </Box>
      <Box>
        <Text>
          {currentDisplay.map((byte, idx) => {
            const reactNodes: ReactNode[] = [];
            if (idx % 16 === 0) {
              reactNodes.push(<Text>{h16(idx + currentOffset)} </Text>);
            }
            reactNodes.push(
              <Text
                backgroundColor={idx + currentOffset === selected ? "cyan" : ""}
              >
                {h8(byte)}
              </Text>,
              <Text> </Text>
            );
            if ((idx + 1) % 16 === 0) {
              reactNodes.push(<Newline />);
            }
            return reactNodes;
          })}
        </Text>
      </Box>
    </Box>
  );
}
