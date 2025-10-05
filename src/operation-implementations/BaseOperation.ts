import { BehaviorSubject } from "rxjs";
import type { Cog } from "../chip/Cog.js";
import { decomposeOpcode } from "../decomposeOpcode.js";
import type { Operation } from "../Operation.js";

export type OpDescription = {
  execute: (srcValue: number, destValue: number) => number;
  z: (srcValue: number, destValue: number, result: number) => boolean;
  c: (srcValue: number, destValue: number, result: number) => boolean;
  signed?: boolean;
};

export type RegisterRole = {
  read: "value" | "address";
  write: "value" | "address" | "none";
};

export class BaseOperation {
  protected srcValue: number = 0;
  protected destValue: number = 0;
  public readonly hubOperation: boolean = false;

  protected roles: {
    src: RegisterRole;
    dest: RegisterRole;
  } = {
    src: { read: "value", write: "none" },
    dest: { read: "value", write: "value" },
  };

  protected result: number = 0;
  protected writeResult: boolean = true;
  public readonly operation = new BehaviorSubject<Operation | null>(null);

  constructor(
    public registerValue: number,
    public cog: Cog,
    public signedReads: boolean
  ) {
    this.operation.next(decomposeOpcode(registerValue));
    process.stderr.write(
      `Decoded operation: ${JSON.stringify(this.operation.value)}\n`
    );
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

    this.writeResult = this.rFlag;
    this.srcValue =
      this.roles.src.read === "value"
        ? op.src
        : this.signedReads
        ? this.cog.readRegister(op.src)
        : this.cog.readURegister(op.src);

    this.destValue =
      this.roles.dest.read === "value"
        ? op.dest
        : this.signedReads
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

    process.stderr.write(
      `Executing operation: ${JSON.stringify(op)}\n` +
        `  SrcValue: ${this.srcValue} DestValue: ${this.destValue}; ZCRI: ${this.zFlag} ${this.cFlag} ${this.iFlag} ${this.rFlag}\n`
    );

    await this.performOperation();

    if (this.writeResult) {
      const writeAddress =
        this.roles.dest.write === "address" ? this.destValue : op.dest;

      process.stderr.write(
        `  Writing result ${this.result & 0xffffffff} to ${writeAddress} (as ${
          this.signedReads ? "signed" : "unsigned"
        })\n`
      );
      if (this.signedReads) {
        this.cog.writeRegister(writeAddress, this.result & 0xffffffff);
      } else {
        this.cog.writeURegister(writeAddress, this.result & 0xffffffff);
      }
    }

    if (this.zFlag) {
      process.stderr.write(`  Setting Z flag\n`);
      this.setZ();
    }
    if (this.cFlag) {
      process.stderr.write(`  Setting C flag\n`);
      this.setC();
    }

    return Promise.resolve();
  }

  updatePC(): void {
    this.cog.setPC(this.cog.pc + 1);
  }
}
