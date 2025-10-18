import { BaseOperation } from "../BaseOperation.js";
import { get_parity } from "../utils/get_parity.js";

export class ANDOperation extends BaseOperation {
  constructor(...args: ConstructorParameters<typeof BaseOperation>) {
    super(...args);
    this.signedReads = true;
  }

  override _execute(): Promise<void> {
    this.result = this.destOperand & this.srcOperand;
    return Promise.resolve();
  }

  override setZ(): void {
    this.cog.updateZFlag(this.result === 0);
  }

  override setC(): void {
    this.cog.updateCFlag(get_parity(this.result));
  }
}
