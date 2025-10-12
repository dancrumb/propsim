import { BaseOperation } from "./BaseOperation.js";

export class ADDSOperation extends BaseOperation {
  override signedReads = true;

  override _execute(): Promise<void> {
    this.result = this.srcOperand + this.destOperand;
    return Promise.resolve();
  }

  override setZ(): void {
    this.cog.updateZFlag((this.result & 0xffffffff) === 0);
  }

  override setC(): void {
    this.cog.updateCFlag(this.result > 0xffffffff);
  }
}
