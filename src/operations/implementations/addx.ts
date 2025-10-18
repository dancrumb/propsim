import { BaseOperation } from "../BaseOperation.js";

export class ADDXOperation extends BaseOperation {
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
    const sum =
      (this.srcOperand >>> 0) + (this.destOperand >>> 0) + (this.cog.C ? 1 : 0);
    if (sum > 0xffffffff) {
      this.cog.updateCFlag(true);
      return;
    }
    this.cog.updateCFlag(false);
  }
}
