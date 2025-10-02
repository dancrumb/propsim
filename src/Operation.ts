import type { OpCode } from "./opcodes.js";

export type Operation = {
  instr: OpCode | "NOP";
  zcri: number;
  con: number;
  dest: number;
  src: number;
};
