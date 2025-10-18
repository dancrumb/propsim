import { readdirSync } from "node:fs";
import type { Cog } from "../chip/Cog.js";
import { decodeOpcode } from "../opcodes/decodeOpcode.js";
import { isOpCode, type OpCode } from "../opcodes/opcodes.js";
import type { Operation } from "../Operation.js";
import { NOPOperation } from "./implementations/nop.js";

const OPERATIONS: Partial<
  Record<OpCode | "NOP", new (registerValue: number, cog: Cog) => Operation>
> = {
  NOP: NOPOperation,
};

await readdirSync(`${import.meta.dirname}/implementations`).map(
  async (modName) => {
    const mod = await import(
      `./implementations/${modName.replace(".ts", ".js")}`
    );
    Object.entries(mod).forEach(([exportName, exportValue]) => {
      if (exportName.endsWith("Operation")) {
        const inst = exportName.replace("Operation", "");
        if (isOpCode(inst)) {
          if (OPERATIONS[inst]) {
            throw new Error(
              `Duplicate operation implementation for ${inst} - probably forgot to change the class name?`
            );
          }
          OPERATIONS[inst] = exportValue as new () => Operation;
        }
      }
    });
  }
);

export class OperationFactory {
  static createOperation(registerValue: number, cog: Cog): Operation | null {
    const { instr, con } = decodeOpcode(registerValue) ?? {};

    if (!instr) {
      return null;
    }

    let opCtor = OPERATIONS[instr];
    if (!opCtor) {
      throw new Error(`No implementation found for ${instr}`);
    }
    let opCode: Operation = new NOPOperation(registerValue, cog);

    switch (con) {
      case "ALWAYS":
        opCode = new opCtor(registerValue, cog);
        break;
      case "NEVER":
        break;
      case "E":
        if (cog.Z) {
          opCode = new opCtor(registerValue, cog);
        }
        break;
      case "NE":
        if (!cog.Z) {
          opCode = new opCtor(registerValue, cog);
        }
        break;
      case "A":
        if (!cog.C && !cog.Z) {
          opCode = new opCtor(registerValue, cog);
        }
        break;
      case "AE":
        if (!cog.C) {
          opCode = new opCtor(registerValue, cog);
        }
        break;
      case "B":
        if (cog.C) {
          opCode = new opCtor(registerValue, cog);
        }
        break;
      case "BE":
        if (cog.C || cog.Z) {
          opCode = new opCtor(registerValue, cog);
        }
        break;
      case "C_EQ_Z":
        if (cog.C === cog.Z) {
          opCode = new opCtor(registerValue, cog);
        }
        break;
      case "C_NE_Z":
        if (cog.C !== cog.Z) {
          opCode = new opCtor(registerValue, cog);
        }
        break;
      case "C_AND_Z":
        if (cog.C && cog.Z) {
          opCode = new opCtor(registerValue, cog);
        }
        break;
      case "C_AND_NZ":
        if (cog.C && !cog.Z) {
          opCode = new opCtor(registerValue, cog);
        }
        break;
      case "C_OR_NZ":
        if (!cog.C && !cog.Z) {
          opCode = new opCtor(registerValue, cog);
        }
        break;
      case "NC_AND_Z":
        if (!cog.C && cog.Z) {
          opCode = new opCtor(registerValue, cog);
        }
        break;
      case "NC_OR_NZ":
        if (!cog.C || !cog.Z) {
          opCode = new opCtor(registerValue, cog);
        }
        break;
      case "NC_OR_Z":
        if (!cog.C || cog.Z) {
          opCode = new opCtor(registerValue, cog);
        }
        break;

      default:
        throw new Error(`Unknown condition code: ${con}`);
        break;
    }

    return opCode;
  }
}
