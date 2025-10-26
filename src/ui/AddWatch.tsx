import { Box, Newline, Text, useInput } from "ink";
import assert from "node:assert";
import React from "react";
import { useDialog } from "../DialogProvider.js";
import { WatchLocation } from "../ObservableBuffer.js";
import { inkLog } from "../ink-log.js";

type Watch = {
  from: number;
  to: number;
  location: WatchLocation;
  as: "BYTE" | "WORD" | "DWORD";
};

type AddWatchProps = {
  onAddWatch?: (watchString: Watch) => void;
};

const parseWatchString = (watchString: string): Watch => {
  const [location, from, to, asString] = watchString
    .trim()
    .split(":")
    .map((x) => x.toUpperCase());
  if (asString === undefined) {
    throw new Error("Invalid Watch String");
  }
  inkLog(`location: ${location}; from: ${from}; to: ${to}; as: ${asString};`);
  assert(location !== undefined, "Location is defined");
  assert(from !== undefined, "From is defined");
  assert(to !== undefined, "To is defined");
  if (!["M", "0", "1", "2", "3", "4", "5", "6", "7"].includes(location)) {
    throw new Error(`Invalid location: ${location}`);
  }
  const fromAddress = parseInt(from, 16);
  const toAddress = parseInt(to, 16);
  const as = asString.replace(/S$/, "");
  if (!["BYTE", "WORD", "DWORD"].includes(as)) {
    throw new Error(`Invalid 'as': ${asString}`);
  }
  assert(as === "BYTE" || as === "WORD" || as === "DWORD", "as is correct");
  return {
    location: location === "M" ? WatchLocation.Main : parseInt(location, 10),
    from: fromAddress,
    to: toAddress,
    as,
  };
};

export function AddWatch({ onAddWatch }: AddWatchProps) {
  const { closeDialog } = useDialog();
  const [inputValue, setInputValue] = React.useState("");

  useInput((input, key) => {
    if (key.backspace || key.delete) {
      setInputValue((v) => v.slice(0, v.length - 1));
    } else if (key.return) {
      try {
        const watch = parseWatchString(inputValue);
        onAddWatch?.(watch);
        closeDialog("AddWatch");
      } catch (error) {
        inkLog(String(error));
      }
    } else {
      setInputValue((v) => v + input);
    }
  });
  return (
    <Box flexDirection="column" alignItems="flex-start" paddingX={1} gap={0}>
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        width="100%"
        marginBottom={1}
      >
        <Text>Watch</Text>
      </Box>
      <Box>
        <Text>location:start:end:as</Text>
      </Box>
      <Box paddingLeft={2}>
        <Text>
          <Text color={"cyan"}>location</Text>
          <Text>: M for Main RAM or 0-7 for Cog RAM</Text>
          <Newline />
          <Text color={"cyan"}>from</Text>
          <Text>
            : start address; RAM location for Main, register number for Cog
          </Text>
          <Newline />
          <Text color={"cyan"}>to</Text>
          <Text>
            : end address; RAM location for Main, register number for Cog
          </Text>
          <Newline />
          <Text color={"cyan"}>as</Text>
          <Text>: render as bytes, words or dwords</Text>
          <Newline />
          <Newline />

          <Text>e.g. m:100:200:bytes</Text>
          <Newline />
        </Text>
      </Box>
      <Box
        flexDirection="row"
        width="100%"
        justifyContent="center"
        alignItems="center"
        marginTop={2}
      >
        <Box paddingX={2} width={24} height={3} borderStyle={"single"}>
          <Text>{inputValue}</Text>
        </Box>
      </Box>
    </Box>
  );
}
