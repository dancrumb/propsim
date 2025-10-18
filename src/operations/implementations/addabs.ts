import { BaseOperation } from "../BaseOperation.js";
import { abs_val } from "./abs-val.js";
import { sgn_val } from "./sgn_val.js";

export class ADDABSOperation extends BaseOperation {
  override signedReads = true;

  override _execute(): Promise<void> {
    this.result =
      (abs_val(this.srcOperand) + (this.destOperand >>> 0)) & 0xffff_ffff;
    return Promise.resolve();
  }

  override setZ(): void {
    this.cog.updateZFlag(this.result === 0);
  }

  override setC(): void {
    const overflow =
      abs_val(this.srcOperand) + (this.destOperand >>> 0) > 0xffffffff;
    this.cog.updateCFlag(sgn_val(this.srcOperand) < 0 ? !overflow : overflow);
  }
}
