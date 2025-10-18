import { SRC_MASK } from "../../opcodes/masks.js";
import { BaseOperation } from "../BaseOperation.js";

export class MOVSOperation extends BaseOperation {
  override _execute(): Promise<void> {
    this.result = this.destOperand & ~SRC_MASK;
    this.result |= this.srcOperand & 0b111111111;
    this.result >>>= 0;
    return Promise.resolve();
  }

  override setZ(): void {
    this.cog.updateZFlag((this.srcOperand & 0x1ff) === 0);
  }

  // This behavior is inferred because the manual does not make it clear
  // Essentially, C is set if the MSB of the source is set and the destination changes
  override setC(): void {
    this.cog.updateCFlag(
      (this.srcOperand & 0b100000000) !== 0 && this.result !== this.destOperand
    );
  }
}
