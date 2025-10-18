import { BaseOperation } from "../BaseOperation.js";

export class JMPOperation extends BaseOperation {
  override _execute(): Promise<void> {
    this.writeResult = false;
    return Promise.resolve();
  }

  override setC(): void {}

  override getNextExpectedPC() {
    return this.srcValue;
  }
}
