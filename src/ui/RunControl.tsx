import { Box, Text, useInput } from "ink";
import React from "react";

export type RunSpeed = "x1" | "x2" | "x3" | "paused";

export default function RunControl({
  onChangeState,
  state,
}: {
  state: RunSpeed;
  onChangeState: (state: RunSpeed) => void;
}) {
  useInput((input) => {
    if (input === ">") {
      if (state === "paused") {
        onChangeState("x1");
      } else if (state === "x1") {
        onChangeState("x2");
      } else if (state === "x2") {
        onChangeState("x3");
      }
    } else if (input === "|") {
      onChangeState("paused");
    } else if (input === "<") {
      if (state === "x3") {
        onChangeState("x2");
      } else if (state === "x2") {
        onChangeState("x1");
      } else if (state === "x1") {
        onChangeState("paused");
      }
    }
  });

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
