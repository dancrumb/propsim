import { DEST_MASK } from "../../opcodes/masks.js";
import { BaseOperation } from "../BaseOperation.js";

export class MOVDOperation extends BaseOperation {
  override _execute(): Promise<void> {
    this.result = this.destOperand & ~DEST_MASK;
    this.result |= this.srcOperand << 9;
    this.result >>>= 0;
    return Promise.resolve();
  }

  override setZ(): void {
    this.cog.updateZFlag((this.srcOperand & 0x1ff) === 0);
  }

  override setC(): void {
    this.cog.updateCFlag((this.srcOperand & 0b100000000) !== 0);
  }
}
