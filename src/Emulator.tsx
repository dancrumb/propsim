import { Box, Text, useInput, useStdout } from "ink";
import React, { useCallback, useRef } from "react";
import type { Cog } from "./chip/Cog.js";
import { Propeller } from "./chip/Propeller.js";
import CogsDisplay from "./ui/CogsDisplay.js";
import { Dialog } from "./ui/Dialog.js";
import { useEventBus } from "./ui/EventBus.js";
import { GoTo } from "./ui/GoTo.js";
import HubDisplay from "./ui/HubDisplay.js";
import RunControl, { type RunSpeed } from "./ui/RunControl.js";
import SystemClockDisplay from "./ui/SystemClockDisplay.js";

const DIALOGS = {
  GoTo: (onGoto?: (address: number) => void) => <GoTo onGoto={onGoto} />,
};

export default function Demo({ propeller }: { propeller: Propeller }) {
  const [runSpeed, setRunSpeed] = React.useState<RunSpeed>("paused");
  const systemClock = propeller.systemClock;
  const hub = propeller.hub;
  const cogs: Array<Cog> = propeller.cogs;
  const [dialogContent, setDialogContent] =
    React.useState<React.ReactNode>(null);
  const [currentDialog, setCurrentDialog] = React.useState<string | null>(null);

  const { stdout } = useStdout();
  const [currentCog, setCurrentCog] = React.useState(
    Math.max(
      0,
      cogs.findIndex((c) => c.isRunning())
    )
  );
  const runningId = useRef<NodeJS.Timeout | null>(null);

  const openDialog = useCallback(
    (dialogType: string, onGoTo?: (address: number) => void) => {
      setDialogContent(
        DIALOGS[dialogType as keyof typeof DIALOGS]?.(onGoTo) || null
      );
      setCurrentDialog(dialogType);
    },
    []
  );

  useEventBus("requestDialog", openDialog);

  const closeDialog = useCallback(
    (dialogType: string) => {
      if (currentDialog === dialogType) {
        setDialogContent(null);
        setCurrentDialog(null);
      }
    },
    [currentDialog]
  );

  useEventBus("closeDialog", closeDialog);

  const handleRunControlChange = React.useCallback((state: RunSpeed) => {
    if (runningId.current) {
      clearInterval(runningId.current);
      runningId.current = null;
    }
    if (state !== "paused") {
      runningId.current = setInterval(
        () => {
          systemClock.stepForward(1);
        },
        state === "x1" ? 500 : state === "x2" ? 250 : 100
      );
    }
    setRunSpeed(state);
  }, []);

  const pauseSimulation = useCallback(() => {
    handleRunControlChange("paused");
  }, [handleRunControlChange]);

  useEventBus("stopSimulation", pauseSimulation);

  useInput(
    (input) => {
      if (input === "t") {
        systemClock.stepForward(1);
      } else if (["0", "1", "2", "3", "4", "5", "6", "7"].includes(input)) {
        setCurrentCog(parseInt(input, 10));
      } else if (input === "c") {
        systemClock.stepForward(4);
      }
    },
    { isActive: !dialogContent }
  );

  return (
    <Box
      height={stdout.rows}
      width={stdout.columns}
      borderStyle={"double"}
      flexDirection="column"
      paddingX={1}
      position="relative"
    >
      <Box flexDirection="row" height="100%">
        <Box
          flexDirection="column"
          width={12}
          alignItems="center"
          height="100%"
        >
          <Box
            flexDirection="column"
            marginBottom={1}
            width={7}
            alignItems="center"
          >
            <HubDisplay hub={hub} />
            <Box>
              <Text>Hub</Text>
            </Box>
          </Box>
          <SystemClockDisplay systemClock={systemClock} />
        </Box>
        <CogsDisplay currentCog={currentCog} cogs={cogs} />
      </Box>
      <Box flexDirection="row" justifyContent="center" width={"100%"}>
        <RunControl onChangeState={handleRunControlChange} state={runSpeed} />
      </Box>
      <Dialog show={!!dialogContent} onClose={() => setDialogContent(null)}>
        {dialogContent}
      </Dialog>
    </Box>
  );
}
