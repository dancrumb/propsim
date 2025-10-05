import { BaseOperation } from "./BaseOperation.js";

export class COGSTOPOperation extends BaseOperation {
  public readonly hubOperation = true;
  override performOperation(): Promise<void> {
    this.cog.stop();
    return Promise.resolve();
  }

  override updatePC(): void {
    this.cog.setPC(this.cog.pc + 1);
  }

  override setZ(): void {}
  override setC(): void {}
}
