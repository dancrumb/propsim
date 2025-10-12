export const INSTR_MASK = 0b1111_1100_0000_0000_0000_0000_0000_0000;
export const ZCRI_MASK = 0b0000_0011_1100_0000_0000_0000_0000_0000;
export const CON_MASK = 0b0000_0000_0011_1100_0000_0000_0000_0000;
export const DEST_MASK = 0b0000_0000_0000_0011_1111_1110_0000_0000;
export const SRC_MASK = 0b0000_0000_0000_0000_0000_0001_1111_1111;
import { OP_TO_INSTR } from "./opcodes.js";
import type { OperationStructure } from "./OperationStructure.js";
import { conToCode } from "./condition.js";

export function encodeOpcode(operation: OperationStructure): number {
  const { instr, zcri, con, dest, src } = operation;

  const inst = OP_TO_INSTR[instr];

  if (!inst) {
    return 0;
  }

  const conCode = conToCode(con);

  return (
    (((inst << 26) & INSTR_MASK) |
      ((zcri << 22) & ZCRI_MASK) |
      ((conCode << 18) & CON_MASK) |
      ((dest << 9) & DEST_MASK) |
      (src & SRC_MASK)) >>>
    0
  );
}
