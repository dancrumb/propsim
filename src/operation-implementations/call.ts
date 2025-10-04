import { BaseOperation } from "./BaseOperation.js";

export class CALLOperation extends BaseOperation {
  constructor(...args: ConstructorParameters<typeof BaseOperation>) {
    super(...args);
    this.signedReads = false;
  }

  override performOperation(): Promise<void> {
    this.writeResult = false;
    return Promise.resolve();
  }

  override setZ(): void {}

  override setC(): void {}

  override updatePC(): void {
    this.cog.setPC(this.srcValue);
  }
}
