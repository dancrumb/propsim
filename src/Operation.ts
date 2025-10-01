import type { INSTR_TO_OPS } from "./opcodes.js";

export type Operation = {
  instr: (typeof INSTR_TO_OPS)[keyof typeof INSTR_TO_OPS] | "NOP";
  zcri: number;
  con: number;
  dest: number;
  src: number;
};
