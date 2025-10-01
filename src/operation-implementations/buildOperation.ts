import type { CogFlags } from "../CogFlags.js";
import type { CogRam } from "../CogRam.js";
import type { Operation } from "../Operation.js";

export type OpDescription = {
  execute: (srcValue: number, destValue: number) => number;
  z: (srcValue: number, destValue: number, result: number) => boolean;
  c: (srcValue: number, destValue: number, result: number) => boolean;
  signed?: boolean;
};

export const buildOperation =
  (op: OpDescription) =>
  (operation: Operation, cogRam: CogRam, flags: CogFlags) => {
    const srcIsImmediate = (operation.zcri & 0b0001) === 0b0001;
    const srcValue = srcIsImmediate
      ? operation.src
      : op.signed
      ? cogRam.readRegister(operation.src)
      : cogRam.readURegister(operation.src);

    const destValue = op.signed
      ? cogRam.readRegister(operation.dest)
      : cogRam.readURegister(operation.dest);

    const result = op.execute(srcValue, destValue);

    if (operation.zcri & 0b0010) {
      if (op.signed) {
        cogRam.writeRegister(
          operation.dest,
          op.signed ? result & 0xffffffff : (result & 0xffffffff) >>> 0
        );
      } else {
        cogRam.writeURegister(
          operation.dest,
          op.signed ? result & 0xffffffff : (result & 0xffffffff) >>> 0
        );
      }
    }
    if (operation.zcri & 0b1000) {
      // Set zero flag
      flags.Z = op.z(srcValue, destValue, result);
    }
    if (operation.zcri & 0b0100) {
      // Set carry flag
      flags.C = op.c(srcValue, destValue, result);
    }
    return Promise.resolve();
  };
