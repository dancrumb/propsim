import { TJBase } from "./_tjbase.js";

export class TJNZOperation extends TJBase {
  protected override _execute(): Promise<void> {
    this.doJump = this.destOperand !== 0;

    return super._execute();
  }
}
