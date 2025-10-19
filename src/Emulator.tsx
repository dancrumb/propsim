import { Box, Text, useInput, useStdout } from "ink";
import React, { useEffect, useRef } from "react";
import type { Cog } from "./chip/Cog.js";
import { Propeller } from "./chip/Propeller.js";
import CogsDisplay from "./ui/CogsDisplay.js";
import { Dialog } from "./ui/Dialog.js";
import { EventBus } from "./ui/EventBus.js";
import { GoTo } from "./ui/GoTo.js";
import HubDisplay from "./ui/HubDisplay.js";
import RunControl, { type RunSpeed } from "./ui/RunControl.js";
import SystemClockDisplay from "./ui/SystemClockDisplay.js";

const eventBus = EventBus.getInstance();

const DIALOGS = {
  GoTo: (onGoto?: (address: number) => void) => <GoTo onGoto={onGoto} />,
};

export default function Demo({ propeller }: { propeller: Propeller }) {
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

  useEffect(() => {
    const { unsubscribe: unsubOpenDialog } = eventBus.subscribeEvent(
      "requestDialog",
      (dialogType, onGoTo?: (address: number) => void) => {
        setDialogContent(
          DIALOGS[dialogType as keyof typeof DIALOGS]?.(onGoTo) || null
        );
        setCurrentDialog(dialogType);
      }
    );
    const { unsubscribe: unsubCloseDialog } = eventBus.subscribeEvent(
      "closeDialog",
      (dialogType) => {
        if (currentDialog === dialogType) {
          setDialogContent(null);
          setCurrentDialog(null);
        }
      }
    );
    return () => {
      unsubOpenDialog();
      unsubCloseDialog();
    };
  }, [currentDialog]);

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
        state === "x1" ? 500 : 250
      );
    }
  }, []);

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
        <RunControl onChangeState={handleRunControlChange} />
      </Box>
      <Dialog show={!!dialogContent} onClose={() => setDialogContent(null)}>
        {dialogContent}
      </Dialog>
    </Box>
  );
}
