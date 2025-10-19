import { Box, Text, useInput } from "ink";
import React from "react";
import { EventBus } from "./EventBus.js";

type GoToProps = {
  onGoto?: (address: number) => void;
};

const eventBus = EventBus.getInstance();

export function GoTo({ onGoto }: GoToProps) {
  const [inputValue, setInputValue] = React.useState("");
  useInput((input, key) => {
    process.stderr.write(`Input: ${input}\n`);
    process.stderr.write(`Key: ${JSON.stringify(key)}\n`);
    if (key.backspace || key.delete) {
      setInputValue((v) => v.slice(0, v.length - 1));
    } else if (key.return) {
      onGoto?.(parseInt(inputValue, 16) || 0);
      eventBus.emitEvent("closeDialog", "GoTo");
    } else if (input.match(/^[0-9a-fA-F]$/)) {
      setInputValue((v) => (v.length <= 4 ? v + input : v));
    }
  });
  return (
    <Box flexDirection="column" alignItems="flex-start" paddingX={1} gap={0}>
      <Box>
        <Text>Go To</Text>
      </Box>
      <Box paddingX={2} width={12} height={3} borderStyle={"single"}>
        <Text>{inputValue}</Text>
      </Box>
    </Box>
  );
}
