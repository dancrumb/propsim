import type { Cog } from "../chip/Cog.js";
import { BaseOperation } from "./BaseOperation.js";

export class SUBOperation extends BaseOperation {
  protected override roles = {
    src: { read: "value", write: "none" },
    dest: { read: "address", write: "value" },
  } as const;

  constructor(registerValue: number, cog: Cog) {
    super(registerValue, cog, false);
  }

  override _execute(): Promise<void> {
    this.result = this.destOperand - this.srcOperand;
    return Promise.resolve();
  }

  override setZ(): void {
    this.cog.updateZFlag((this.result & 0xffffffff) === 0);
  }

  override setC(): void {
    this.cog.updateCFlag(this.result > 0xffffffff);
  }
}
