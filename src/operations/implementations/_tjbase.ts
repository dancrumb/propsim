import { BaseOperation } from "../BaseOperation.js";

export class TJBase extends BaseOperation {
  protected override writeResult = false;
  protected doJump: boolean = true;

  protected override _execute(): Promise<void> {
    return Promise.resolve();
  }

  override setZ(): void {
    this.cog.updateZFlag(this.destOperand === 0);
  }

  override getNextExpectedPC(): number {
    this.fetchDstOperand();
    if (this.doJump) {
      return this.srcOperand;
    }

    return super.getNextExpectedPC();
  }

  override _complete(): void {
    if (!this.doJump) {
      this.cog.resetPipeline();
    }
  }
}
