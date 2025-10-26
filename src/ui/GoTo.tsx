import { Box, Text, useInput } from "ink";
import React from "react";
import { useDialog } from "../DialogProvider.js";

type GoToProps = {
  onGoto?: (address: number) => void;
};

export function GoTo({ onGoto }: GoToProps) {
  const { closeDialog } = useDialog();
  const [inputValue, setInputValue] = React.useState("");
  useInput((input, key) => {
    if (key.backspace || key.delete) {
      setInputValue((v) => v.slice(0, v.length - 1));
    } else if (key.return) {
      onGoto?.(parseInt(inputValue, 16) || 0);
      closeDialog("GoTo");
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
