import React from "react";
import { Box, useInput, Text } from "ink";

export type RunSpeed = "x1" | "x2" | "paused";

export default function RunControl({
  onChangeState,
}: {
  onChangeState?: (state: RunSpeed) => void;
}) {
  const [state, setState] = React.useState<RunSpeed>("paused");

  useInput((input) => {
    if (input === ">") {
      if (state === "x1") {
        setState("x2");
      } else {
        setState("x1");
      }
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
        borderColor={state === "x1" ? "brightWhite" : "gray"}
      >
        <Text color={state === "x1" ? "brightWhite" : "gray"}>{"▷"}</Text>
      </Box>
      <Box
        borderStyle={"round"}
        width={5}
        justifyContent="center"
        borderColor={state === "x2" ? "brightWhite" : "gray"}
      >
        <Text color={state === "x2" ? "brightWhite" : "gray"}>{"»"}</Text>
      </Box>
    </Box>
  );
}
