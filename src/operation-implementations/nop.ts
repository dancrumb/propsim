import { BaseOperation } from "./BaseOperation.js";

export class NOPOperation extends BaseOperation {
  override performOperation(): Promise<void> {
    return Promise.resolve();
  }

  override updatePC(): void {
    this.cog.setPC(this.cog.pc + 1);
  }

  override setZ(): void {}
  override setC(): void {}
}
