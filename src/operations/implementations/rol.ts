import { BaseOperation } from "../BaseOperation.js";
import { rol } from "../utils/rol.js";

export class ROLOperation extends BaseOperation {
  override _execute(): Promise<void> {
    this.result = rol(this.destOperand, this.srcOperand);
    return Promise.resolve();
  }

  override setZ(): void {
    this.cog.updateZFlag(this.result === 0);
  }

  override setC(): void {
    this.cog.updateCFlag((this.destOperand & 0x8000_0000) !== 0);
  }
}
