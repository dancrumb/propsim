import { BaseOperation } from "../BaseOperation.js";
import { abs_val } from "../utils/abs_val.js";

export class ABSOperation extends BaseOperation {
  constructor(...args: ConstructorParameters<typeof BaseOperation>) {
    super(...args);
    this.signedReads = true;
  }

  override _execute(): Promise<void> {
    this.result = abs_val(this.srcOperand);
    return Promise.resolve();
  }

  override setZ(): void {
    this.cog.updateZFlag(this.srcOperand === 0);
  }

  override setC(): void {
    this.cog.updateCFlag((this.srcOperand & 0x8000_0000) !== 0);
  }
}
