import type { WatchLocation } from "../ObservableBuffer.js";

export type Watch = {
  id: number;
  from: number;
  to: number;
  location: WatchLocation;
  as: "BYTE" | "WORD" | "DWORD";
};
