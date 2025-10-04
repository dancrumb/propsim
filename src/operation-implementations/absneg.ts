import type { CogFlags } from "../CogFlags.js";
import type { CogRam } from "../CogRam.js";
import { type Operation } from "../Operation.js";
import { BaseOperation } from "./BaseOperation.js";

export class ABSNEGOperation extends BaseOperation {
  constructor(...args: ConstructorParameters<typeof BaseOperation>) {
    super(...args);
    this.signedReads = true;
  }

  override performOperation(): Promise<void> {
    this.result = -Math.abs(this.srcValue);
    return Promise.resolve();
  }

  override setZ(): void {
    this.cog.updateZFlag(this.result === 0);
  }

  override setC(): void {
    this.cog.updateCFlag(this.srcValue < 0);
  }
}
