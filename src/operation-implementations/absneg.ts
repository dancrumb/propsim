import { BaseOperation } from "./BaseOperation.js";

export class ABSNEGOperation extends BaseOperation {
  constructor(...args: ConstructorParameters<typeof BaseOperation>) {
    super(...args);
    this.signedReads = true;
  }

  override _execute(): Promise<void> {
    this.result = -Math.abs(this.srcOperand);
    return Promise.resolve();
  }

  override setZ(): void {
    this.cog.updateZFlag(this.result === 0);
  }

  override setC(): void {
    this.cog.updateCFlag(this.srcOperand < 0);
  }
}
