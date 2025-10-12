import { BaseOperation } from "./BaseOperation.js";

export class NOPOperation extends BaseOperation {
  override _execute(): Promise<void> {
    return Promise.resolve();
  }

  override storeResult(): void {
    // NOOP does not store any result
  }
  override setZ(): void {}
  override setC(): void {}
}
