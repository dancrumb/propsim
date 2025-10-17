import { conToCode } from "../condition.js";
import type { OperationStructure } from "./OperationStructure.js";
import {
  CON_MASK,
  DEST_MASK,
  INSTR_MASK,
  SRC_MASK,
  ZCRI_MASK,
} from "./masks.js";
import { OP_TO_INSTR } from "./opcodes.js";

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

export const op = (
  instr: OperationStructure["instr"],
  zcri: OperationStructure["zcri"],
  con: OperationStructure["con"],
  dest: OperationStructure["dest"],
  src: OperationStructure["src"]
) =>
  encodeOpcode({
    instr,
    zcri,
    con,
    dest,
    src,
  });
