import React from "react";

import { Dialog } from "./ui/Dialog.js";
import { GoTo } from "./ui/GoTo.js";

const DIALOGS = {
  GoTo: (onGoto?: (address: number) => void) => <GoTo onGoto={onGoto} />,
};

const DialogContext = React.createContext<{
  openDialog: (dialogType: string, onGoTo?: (address: number) => void) => void;
  closeDialog: (dialogType: string) => void;
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
    (dialogType: string, onGoTo?: (address: number) => void) => {
      setDialogContent(
        DIALOGS[dialogType as keyof typeof DIALOGS]?.(onGoTo) || null
      );
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
