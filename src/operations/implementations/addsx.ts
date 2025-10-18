import { BaseOperation } from "../BaseOperation.js";
import { sgn_val } from "./sgn_val.js";

export class ADDSXOperation extends BaseOperation {
  override _execute() {
    this.result = (this.srcOperand >>> 0) + (this.destOperand >>> 0);
    this.result += this.cog.C ? 1 : 0;
    this.result >>>= 0;
    this.result &= 0xffffffff;

    return Promise.resolve();
  }

  override setZ(): void {
    if (this.cog.Z) {
      this.cog.updateZFlag((this.result & 0xffffffff) === 0);
    } else {
      this.cog.updateZFlag(false);
    }
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
