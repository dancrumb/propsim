import { BaseOperation } from "../BaseOperation.js";
import { sgn_val } from "./sgn_val.js";

export class ADDSOperation extends BaseOperation {
  override signedReads = true;

  override _execute(): Promise<void> {
    this.result =
      ((this.srcOperand >>> 0) + (this.destOperand >>> 0)) & 0xffffffff;
    return Promise.resolve();
  }

  override setZ(): void {
    this.cog.updateZFlag((this.result & 0xffffffff) === 0);
  }

  override setC(): void {
    const srcSgn = Math.sign(sgn_val(this.srcOperand));
    const destSgn = Math.sign(sgn_val(this.destOperand));
    const resultSgn = Math.sign(sgn_val(this.result));
    if (srcSgn === destSgn && destSgn !== resultSgn) {
      this.cog.updateCFlag(true);
      return;
    }
    this.cog.updateCFlag(false);
  }
}
