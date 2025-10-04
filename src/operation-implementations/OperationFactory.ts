import type { Cog } from "../Cog.js";
import { type OpCode } from "../opcodes.js";
import { ABSOperation } from "./abs.js";
import { ABSNEGOperation } from "./absneg.js";
import type { BaseOperation } from "./BaseOperation.js";
import { decomposeOpcode } from "../decomposeOpcode.js";
import { NOPOperation } from "./nop.js";
import { ADDOperation } from "./add.js";
import { ADDABSOperation } from "./addabs.js";

const OPERATIONS: Partial<Record<OpCode | "NOP", typeof BaseOperation>> = {
  ABS: ABSOperation,
  ABSNEG: ABSNEGOperation,
  ADDABS: ADDABSOperation,
  ADD: ADDOperation,
  NOP: NOPOperation,
  // Add other operations here
};

export class OperationFactory {
  static createOperation(
    registerValue: number,
    cog: Cog
  ): BaseOperation | null {
    const { instr } = decomposeOpcode(registerValue) ?? {};

    if (!instr) {
      return null;
    }
    const opCode = OPERATIONS[instr] ?? NOPOperation;

    return new opCode(registerValue, cog, false);
  }
}
