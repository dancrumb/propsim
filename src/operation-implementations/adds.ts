import { buildOperation } from "./buildOperation.js";

export const ADDS = buildOperation({
  execute(srcValue: number, destValue: number) {
    return srcValue + destValue;
  },
  z(srcValue: number, destValue: number, result: number) {
    return (result & 0xffffffff) === 0;
  },
  c(srcValue: number, destValue: number, result: number) {
    return result > 0xffffffff;
  },
  signed: true,
});
