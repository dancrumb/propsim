import { BaseOperation } from "../BaseOperation.js";

export class ABSNEGOperation extends BaseOperation {
  constructor(...args: ConstructorParameters<typeof BaseOperation>) {
    super(...args);
  }

  override _execute(): Promise<void> {
    this.result = this.srcOperand;
    if ((this.result & 0x8000_0000) === 0) {
      this.result = ~this.result;
      this.result >>>= 0;
      this.result++;
      this.result & 0xffff_ffff;
    }
    return Promise.resolve();
  }

  override setZ(): void {
    this.cog.updateZFlag(this.srcOperand === 0);
  }

  override setC(): void {
    this.cog.updateCFlag((this.srcOperand & 0x8000_0000) !== 0);
  }
}
