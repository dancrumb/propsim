import { BaseOperation } from "../BaseOperation.js";

export class MOVOperation extends BaseOperation {
  override _execute() {
    return Promise.resolve();
  }

  override setC(): void {
    this.cog.updateCFlag((this.srcOperand & 0b1_0000_0000) !== 0);
  }

  override setZ(): void {
    this.cog.updateZFlag(this.srcOperand === 0);
  }

  override storeResult(): void {
    this.cog.writeRegister(this.destValue, this.srcOperand);
  }
}
