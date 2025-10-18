import { BaseOperation } from "../BaseOperation.js";

export class CALLOperation extends BaseOperation {
  override _execute(): Promise<void> {
    this.writeResult = false;
    return Promise.resolve();
  }

  override setZ(): void {}

  override setC(): void {}

  override getNextExpectedPC(): number {
    return this.srcOperand;
  }
}
