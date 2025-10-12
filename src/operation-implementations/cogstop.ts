import { BaseOperation } from "./BaseOperation.js";

export class COGSTOPOperation extends BaseOperation {
  public override readonly hubOperation = true;
  private allCogsRunning: boolean = false;

  override _execute(): Promise<void> {
    this.allCogsRunning = this.cog.hub.cogStatuses$.getValue().every((c) => c);
    this.cog.stop();
    return Promise.resolve();
  }

  override setZ(): void {
    this.cog.updateZFlag(this.cog.id === 0);
  }

  override setC(): void {
    this.cog.updateCFlag(this.allCogsRunning);
  }
}
