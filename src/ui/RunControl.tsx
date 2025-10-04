import React from "react";
import { Box, useInput, Text } from "ink";

export default function RunControl({
  onChangeState,
}: {
  onChangeState?: (state: "running" | "paused") => void;
}) {
  const [state, setState] = React.useState<"running" | "paused">("paused");

  useInput((input, key) => {
    if (input === ">") {
      setState("running");
    } else if (input === "|") {
      setState("paused");
    }
  });

  React.useEffect(() => {
    if (onChangeState) {
      onChangeState(state);
    }
  }, [state, onChangeState]);
  return (
    <Box flexDirection="row">
      <Box
        borderStyle={"round"}
        width={5}
        justifyContent="center"
        borderColor={state === "paused" ? "brightWhite" : "gray"}
      >
        <Text color={state === "paused" ? "brightWhite" : "gray"}>{"☐"}</Text>
      </Box>
      <Box
        borderStyle={"round"}
        width={5}
        justifyContent="center"
        borderColor={state === "running" ? "brightWhite" : "gray"}
      >
        <Text color={state === "running" ? "brightWhite" : "gray"}>{"▷"}</Text>
      </Box>
    </Box>
  );
}
