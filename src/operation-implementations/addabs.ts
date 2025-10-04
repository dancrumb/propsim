import { BaseOperation } from "./BaseOperation.js";

export class ADDABSOperation extends BaseOperation {
  override performOperation(): Promise<void> {
    this.result = Math.abs(this.srcValue) + this.destValue;
    return Promise.resolve();
  }

  override setZ(): void {
    this.cog.updateZFlag((this.result & 0xffffffff) === 0);
  }

  override setC(): void {
    this.cog.updateCFlag(this.result > 0xffffffff);
  }
}
