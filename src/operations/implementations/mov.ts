import { BaseOperation } from "../BaseOperation.js";

export class MOVOperation extends BaseOperation {
  override _execute() {
    return Promise.resolve();
  }

  override setC(): void {
    this.cog.updateCFlag((this.srcValue & 0x80000000) !== 0);
  }

  override setZ(): void {
    this.cog.updateZFlag(this.srcValue === 0);
  }

  override storeResult(): void {
    this.cog.writeRegister(this.destValue, this.srcOperand);
  }
}
