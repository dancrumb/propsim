import { BaseOperation } from "../BaseOperation.js";

export class CMPOperation extends BaseOperation {
  override signedReads = false;

  override _execute(): Promise<void> {
    this.result = this.destOperand - this.srcOperand;
    return Promise.resolve();
  }

  override setZ(): void {
    this.cog.updateZFlag(this.destOperand === this.srcOperand);
  }

  override setC(): void {
    this.cog.updateCFlag(this.destOperand < this.srcOperand);
  }
}
