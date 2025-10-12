import type { Cog } from "../chip/Cog.js";
import { decomposeOpcode } from "../decomposeOpcode.js";
import { type OpCode } from "../opcodes.js";
import type { Operation } from "../Operation.js";
import { ABSOperation } from "./abs.js";
import { ABSNEGOperation } from "./absneg.js";
import { ADDOperation } from "./add.js";
import { ADDABSOperation } from "./addabs.js";
import type { BaseOperation } from "./BaseOperation.js";
import { CALLOperation } from "./call.js";
import { COGSTOPOperation } from "./cogstop.js";
import { JMPOperation } from "./jmp.js";
import { NOPOperation } from "./nop.js";
import { SUBOperation } from "./sub.js";
import { WAITCNTOperation } from "./waitcnt.js";

const OPERATIONS: Partial<Record<OpCode | "NOP", typeof BaseOperation>> = {
  ABS: ABSOperation,
  ABSNEG: ABSNEGOperation,
  ADDABS: ADDABSOperation,
  ADD: ADDOperation,
  CALL: CALLOperation,
  COGSTOP: COGSTOPOperation,
  JMP: JMPOperation,
  NOP: NOPOperation,
  SUB: SUBOperation,
  WAITCNT: WAITCNTOperation,
  // Add other operations here
};

export class OperationFactory {
  static createOperation(registerValue: number, cog: Cog): Operation | null {
    const { instr, con } = decomposeOpcode(registerValue) ?? {};

    if (!instr) {
      return null;
    }

    let opCtor = OPERATIONS[instr];
    if (!opCtor) {
      throw new Error(`No implementation found for ${instr}`);
    }
    let opCode: Operation = new NOPOperation(registerValue, cog, false);

    switch (con) {
      case "ALWAYS":
        opCode = new opCtor(registerValue, cog, false);
        break;
      case "NEVER":
        break;
      case "E":
        if (cog.Z) {
          opCode = new opCtor(registerValue, cog, false);
        }
        break;
      case "NE":
        if (!cog.Z) {
          opCode = new opCtor(registerValue, cog, false);
        }
        break;
      case "A":
        if (!cog.C && !cog.Z) {
          opCode = new opCtor(registerValue, cog, false);
        }
        break;
      case "AE":
        if (!cog.C) {
          opCode = new opCtor(registerValue, cog, false);
        }
        break;
      case "B":
        if (cog.C) {
          opCode = new opCtor(registerValue, cog, false);
        }
        break;
      case "BE":
        if (cog.C || cog.Z) {
          opCode = new opCtor(registerValue, cog, false);
        }
        break;
      case "C_EQ_Z":
        if (cog.C === cog.Z) {
          opCode = new opCtor(registerValue, cog, false);
        }
        break;
      case "C_NE_Z":
        if (cog.C !== cog.Z) {
          opCode = new opCtor(registerValue, cog, false);
        }
        break;
      case "C_AND_Z":
        if (cog.C && cog.Z) {
          opCode = new opCtor(registerValue, cog, false);
        }
        break;
      case "C_AND_NZ":
        if (cog.C && !cog.Z) {
          opCode = new opCtor(registerValue, cog, false);
        }
        break;
      case "C_OR_NZ":
        if (!cog.C && !cog.Z) {
          opCode = new opCtor(registerValue, cog, false);
        }
        break;
      case "NC_AND_Z":
        if (!cog.C && cog.Z) {
          opCode = new opCtor(registerValue, cog, false);
        }
        break;
      case "NC_OR_NZ":
        if (!cog.C || !cog.Z) {
          opCode = new opCtor(registerValue, cog, false);
        }
        break;
      case "NC_OR_Z":
        if (!cog.C || cog.Z) {
          opCode = new opCtor(registerValue, cog, false);
        }
        break;

      default:
        throw new Error(`Unknown condition code: ${con}`);
        break;
    }

    return opCode;
  }
}
