import { buildOperation } from "./buildOperation.js";

export const ADDABS = buildOperation({
  execute(srcValue: number, destValue: number) {
    return Math.abs(srcValue) + destValue;
  },
  z(srcValue: number, destValue: number, result: number) {
    return (result & 0xffffffff) === 0;
  },
  c(srcValue: number, destValue: number, result: number) {
    return result > 0xffffffff;
  },
  signed: true,
});
