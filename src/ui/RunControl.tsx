import { Box, Text, useInput } from "ink";
import React from "react";

export type RunSpeed = "x1" | "x2" | "x3" | "paused";

export default function RunControl({
  onChangeState,
}: {
  onChangeState?: (state: RunSpeed) => void;
}) {
  const [state, setState] = React.useState<RunSpeed>("paused");

  useInput((input) => {
    if (input === ">") {
      if (state === "paused") {
        setState("x1");
      } else if (state === "x1") {
        setState("x2");
      } else if (state === "x2") {
        setState("x3");
      }
    } else if (input === "|") {
      setState("paused");
    } else if (input === "<") {
      if (state === "x3") {
        setState("x2");
      } else if (state === "x2") {
        setState("x1");
      } else if (state === "x1") {
        setState("paused");
      }
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
        <Text color={state === "x1" ? "brightWhite" : "gray"}>{">"}</Text>
      </Box>
      <Box
        borderStyle={"round"}
        width={5}
        justifyContent="center"
        borderColor={state === "x2" ? "brightWhite" : "gray"}
      >
        <Text color={state === "x2" ? "brightWhite" : "gray"}>{"▷"}</Text>
      </Box>
      <Box
        borderStyle={"round"}
        width={5}
        justifyContent="center"
        borderColor={state === "x3" ? "brightWhite" : "gray"}
      >
        <Text color={state === "x3" ? "brightWhite" : "gray"}>{"»"}</Text>
      </Box>
    </Box>
  );
}
