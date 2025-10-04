import { BaseOperation } from "./BaseOperation.js";

export class SUBOperation extends BaseOperation {
  protected roles = {
    src: { read: "value", write: "none" },
    dest: { read: "address", write: "value" },
  } as const;

  constructor(registerValue: number, cog: import("../Cog.js").Cog) {
    super(registerValue, cog, false);
  }
  override performOperation(): Promise<void> {
    this.result = this.destValue - this.srcValue;
    return Promise.resolve();
  }

  override setZ(): void {
    this.cog.updateZFlag((this.result & 0xffffffff) === 0);
  }

  override setC(): void {
    this.cog.updateCFlag(this.result > 0xffffffff);
  }
}
