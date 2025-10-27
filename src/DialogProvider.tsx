import React from "react";

import { AddWatch } from "./ui/AddWatch.js";
import { Dialog } from "./ui/Dialog.js";
import { GoTo } from "./ui/GoTo.js";
import { type Watch } from "./ui/Watch.js";

const DIALOGS = {
  GoTo: (onGoto?: (address: number) => void) => <GoTo onGoto={onGoto} />,
  AddWatch: (onAddWatch?: (watch: Omit<Watch, "id">) => void) => (
    <AddWatch onAddWatch={onAddWatch} />
  ),
} as const;

type SimDialogs = typeof DIALOGS;

const DialogContext = React.createContext<{
  openDialog: (
    dialogType: keyof SimDialogs,
    ...dialogArgs: Parameters<SimDialogs[typeof dialogType]>
  ) => void;
  closeDialog: (dialogType: keyof SimDialogs) => void;
  dialogIsOpen: boolean;
} | null>(null);

export function useDialog() {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
}

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [dialogContent, setDialogContent] =
    React.useState<React.ReactNode>(null);
  const [currentDialog, setCurrentDialog] = React.useState<string | null>(null);

  const openDialog = React.useCallback(
    (
      dialogType: keyof SimDialogs,
      ...dialogArgs: Parameters<SimDialogs[typeof dialogType]>
    ) => {
      setDialogContent(DIALOGS[dialogType]?.(...(dialogArgs as any)) || null);
      setCurrentDialog(dialogType);
    },
    []
  );

  const closeDialog = React.useCallback(
    (dialogType: string) => {
      if (currentDialog === dialogType) {
        setDialogContent(null);
        setCurrentDialog(null);
      }
    },
    [currentDialog]
  );

  return (
    <DialogContext.Provider
      value={{ openDialog, closeDialog, dialogIsOpen: !!dialogContent }}
    >
      {children}
      <Dialog show={!!dialogContent} onClose={() => setDialogContent(null)}>
        {dialogContent}
      </Dialog>
    </DialogContext.Provider>
  );
}
