import { BaseOperation } from "../BaseOperation.js";

export class SUBOperation extends BaseOperation {
  override _execute(): Promise<void> {
    this.result = (this.destOperand >>> 0) - (this.srcOperand >>> 0);
    return Promise.resolve();
  }

  override setZ(): void {
    this.cog.updateZFlag((this.result & 0xffffffff) === 0);
  }

  override setC(): void {
    this.cog.updateCFlag(this.srcOperand > this.destOperand);
  }
}
