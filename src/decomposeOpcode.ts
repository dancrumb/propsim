export const INSTR_MASK = 0b1111_1100_0000_0000_0000_0000_0000_0000;
export const ZCRI_MASK = 0b0000_0011_1100_0000_0000_0000_0000_0000;
export const CON_MASK = 0b0000_0000_0011_1100_0000_0000_0000_0000;
export const DEST_MASK = 0b0000_0000_0000_0011_1111_1110_0000_0000;
export const SRC_MASK = 0b0000_0000_0000_0000_0000_0001_1111_1111;
import { INSTR_TO_OP } from "./opcodes.js";
import type { Operation } from "./Operation.js";
import type { OpCode } from "./opcodes.js";

export function decomposeOpcode(opcode: number): Operation | null {
  const inst = (opcode & INSTR_MASK) >>> 26;
  const zcri = (opcode & ZCRI_MASK) >>> 22;
  const con = (opcode & CON_MASK) >>> 18;
  const dest = (opcode & DEST_MASK) >>> 9;
  const src = opcode & SRC_MASK;
  if (con === 0) {
    return {
      instr: "NOP",
      zcri: 0,
      con: 0,
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
    con,
    dest,
    src,
  };
}
