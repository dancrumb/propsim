import { h16, h32 } from "../../utils/val-display.js";
import { BaseOperation } from "../BaseOperation.js";

export class WRBYTEOperation extends BaseOperation {
  override hubOperation = true;
  protected override writeResult = false;

  override fetchDstOperand(): void {
    this.destOperand = this.cog.readRegister(this.destValue) & 0xff;
  }

  override _execute(): Promise<void> {
    this.cog.log(
      `Writing ${h32(this.destOperand)} to RAM address ${h16(this.srcOperand)}`
    );
    this.cog.hub.mainRamReader.writeByte(this.srcOperand, this.destOperand);

    return Promise.resolve();
  }

  override setZ(): void {
    this.cog.updateZFlag(this.srcOperand % 4 !== 0);
  }

  override setC(): void {
    this.cog.updateCFlag(false);
  }
}
