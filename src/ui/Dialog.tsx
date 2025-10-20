import { Box, useInput } from "ink";
import React, { type PropsWithChildren } from "react";

export type DialogProps = {
  show?: boolean;
  onClose?: () => void;
};

export function Dialog({
  show,
  onClose,
  children,
}: PropsWithChildren<DialogProps>) {
  useInput((_input, key) => {
    if (key.escape) {
      onClose?.();
    }
  });

  return (
    <Box
      display={show ? "flex" : "none"}
      position="absolute"
      height={"100%"}
      width="100%"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      paddingBottom={1}
    >
      <Box borderStyle={"round"} padding={1} backgroundColor={"black"}>
        {children}
      </Box>
    </Box>
  );
}
