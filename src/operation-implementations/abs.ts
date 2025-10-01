import type { CogFlags } from "../CogFlags.js";
import type { CogRam } from "../CogRam.js";
import { type Operation } from "../Operation.js";
import { buildOperation } from "./buildOperation.js";

export const ABS = buildOperation({
  execute: (srcValue: number, destValue: number) => {
    return Math.abs(srcValue);
  },
  z: (srcValue: number, destValue: number, result: number) => {
    return result === 0;
  },
  c: (srcValue: number, destValue: number, result: number) => {
    return srcValue < 0;
  },
  signed: true,
});
