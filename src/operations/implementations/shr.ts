import { BaseOperation } from "../BaseOperation.js";

export class SHROperation extends BaseOperation {
  override _execute(): Promise<void> {
    this.result = this.destOperand >> this.srcOperand;
    return Promise.resolve();
  }

  override setZ(): void {
    this.cog.updateZFlag(this.result === 0);
  }

  override setC(): void {
    this.cog.updateCFlag((this.destOperand & 0x1) !== 0);
  }
}
