import { CON } from "../condition.js";
import {
  CON_MASK,
  DEST_MASK,
  INSTR_MASK,
  SRC_MASK,
  ZCRI_MASK,
} from "./masks.js";
import type { OpCode } from "./opcodes.js";
import { INSTR_TO_OP } from "./opcodes.js";
import type { OperationStructure } from "./OperationStructure.js";

export function decodeOpcode(opcode: number): OperationStructure | null {
  const inst = (opcode & INSTR_MASK) >>> 26;
  const zcri = (opcode & ZCRI_MASK) >>> 22;
  const con = (opcode & CON_MASK) >>> 18;
  const dest = (opcode & DEST_MASK) >>> 9;
  const src = opcode & SRC_MASK;
  if (con === 0) {
    return {
      instr: "NOP",
      zcri: 0,
      con: "NEVER",
      dest: 0,
      src: 0,
    };
  }

  const instr: OpCode | undefined = INSTR_TO_OP.find(
    ([instCode, discriminators]) => {
      if (inst !== instCode) {
        return false;
      }
      return (
        (discriminators[0] === undefined || discriminators[0] === zcri) &&
        (discriminators[1] === undefined || discriminators[1] === (src & 0b111))
      );
    }
  )?.[2];
  if (!instr) {
    return null;
  }

  return {
    instr,
    zcri,
    con: CON[con as keyof typeof CON]!,
    dest,
    src,
  };
}
