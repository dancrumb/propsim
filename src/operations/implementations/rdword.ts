import { h16 } from "../../utils/val-display.js";
import { BaseOperation } from "../BaseOperation.js";

export class RDWORDOperation extends BaseOperation {
  override hubOperation = true;

  override fetchDstOperand(): void {
    this.destOperand = this.destValue;
  }

  override _execute(): Promise<void> {
    this.cog.log(`Reading from RAM address ${h16(this.srcOperand)}`);
    this.result = this.cog.hub.mainRamReader.readWord(this.srcOperand);

    return Promise.resolve();
  }

  override setZ(): void {
    this.cog.updateZFlag(this.result === 0);
  }

  override setC(): void {
    this.cog.updateCFlag(false);
  }
}
