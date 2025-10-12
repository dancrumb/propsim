import { BaseOperation } from "./BaseOperation.js";

export class ADDABSOperation extends BaseOperation {
  override signedReads = true;

  override _execute(): Promise<void> {
    this.result = Math.abs(this.srcOperand) + this.destOperand;
    return Promise.resolve();
  }

  override setZ(): void {
    this.cog.updateZFlag((this.result & 0xffffffff) === 0);
  }

  override setC(): void {
    this.cog.updateCFlag(this.result > 0xffffffff);
  }
}
