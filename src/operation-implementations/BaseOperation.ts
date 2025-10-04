import { BehaviorSubject } from "rxjs";
import type { Cog } from "../Cog.js";
import { decomposeOpcode } from "../decomposeOpcode.js";
import type { Operation } from "../Operation.js";

export type OpDescription = {
  execute: (srcValue: number, destValue: number) => number;
  z: (srcValue: number, destValue: number, result: number) => boolean;
  c: (srcValue: number, destValue: number, result: number) => boolean;
  signed?: boolean;
};

export class BaseOperation {
  protected srcValue: number = 0;
  protected destValue: number = 0;
  protected result: number = 0;
  public readonly operation = new BehaviorSubject<Operation | null>(null);

  constructor(
    public registerValue: number,
    public cog: Cog,
    public signedReads: boolean
  ) {
    this.operation.next(decomposeOpcode(registerValue));
  }

  get zcri() {
    return this.operation.value?.zcri ?? 0;
  }

  get zFlag() {
    return (this.zcri & 0b1000) !== 0;
  }

  get cFlag() {
    return (this.zcri & 0b0100) !== 0;
  }

  get iFlag() {
    return (this.zcri & 0b0001) !== 0;
  }

  get rFlag() {
    return (this.zcri & 0b0010) !== 0;
  }

  setZ() {
    this.cog.updateZFlag(false);
  }

  setC() {
    this.cog.updateCFlag(false);
  }

  resolve() {
    const op = this.operation.value;
    if (op === null) {
      throw new Error("No operation to resolve");
    }
    this.srcValue = this.iFlag
      ? op.src
      : this.signedReads
      ? this.cog.readRegister(op.src)
      : this.cog.readURegister(op.src);

    this.destValue = this.signedReads
      ? this.cog.readRegister(op.dest)
      : this.cog.readURegister(op.dest);
  }

  performOperation(): Promise<void> {
    return Promise.resolve();
  }

  async execute(): Promise<void> {
    const op = this.operation.value;
    if (op === null) {
      throw new Error("No operation to resolve");
    }

    if (this.rFlag) {
      if (this.signedReads) {
        this.cog.writeRegister(
          this.destValue,
          this.signedReads
            ? this.result & 0xffffffff
            : (this.result & 0xffffffff) >>> 0
        );
      } else {
        this.cog.writeURegister(
          this.destValue,
          this.signedReads
            ? this.result & 0xffffffff
            : (this.result & 0xffffffff) >>> 0
        );
      }

      if (this.zFlag) {
        this.setZ();
      }
      if (this.cFlag) {
        this.setC();
      }
    }

    return Promise.resolve();
  }

  updatePC(): void {
    this.cog.setPC(this.cog.pc + 1);
  }
}
