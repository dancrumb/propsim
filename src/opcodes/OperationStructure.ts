import { CON, type Condition } from "../condition.js";
import type { OpCode } from "./opcodes.js";

export type OperationStructure = {
  instr: OpCode | "NOP";
  zcri: number;
  con: Condition;
  dest: number;
  src: number;
};

const h16 = (n: number) => n.toString(16).padStart(4, "0");
const b4 = (n: number) => n.toString(2).padStart(4, "0");

process.stderr.write(`CONDITIONS: ${JSON.stringify(CON)}\n`);

export const renderOperation = (
  currentOperation: OperationStructure | null
) => {
  if (currentOperation === null) {
    return "None";
  }
  return `${currentOperation.instr.padEnd(8, " ")}${
    currentOperation.instr === "CALL" ? "----" : h16(currentOperation.dest)
  }, ${h16(currentOperation.src)} (ZCRI: ${b4(currentOperation.zcri)}; CON: ${
    currentOperation.con
  })`;
};
