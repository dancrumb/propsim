import { BaseOperation } from "./BaseOperation.js";

export class WAITCNTOperation extends BaseOperation {
  override _execute() {
    this.result = this.srcOperand + this.destOperand;
    this.cog.holdPipeline();

    const { promise, resolve } = Promise.withResolvers<void>();
    const waitHandler = () => {
      const cnt = this.cog.readRegister(0x1f1);
      if (cnt === this.destOperand) {
        this.cog.removeListener("tick", waitHandler);
        this.cog.syncPipeline();
        resolve();
      }
    };
    this.cog.addListener("tick", waitHandler);

    return promise;
  }

  override setZ(): void {
    this.cog.updateZFlag((this.result & 0xffffffff) === 0);
  }

  override setC(): void {
    this.cog.updateCFlag(this.result > 0xffffffff);
  }
}
