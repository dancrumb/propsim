import type { Cog } from "../chip/Cog.js";
import { decomposeOpcode } from "../decomposeOpcode.js";
import type { Operation } from "../Operation.js";
import type { Condition } from "../condition.js";

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

export class BaseOperation implements Operation {
  protected srcOperand: number = 0;
  protected destOperand: number = 0;
  protected result: number = 0;
  protected storeAddress: number = 0;

  public readonly hubOperation: boolean = false;
  protected writeResult: boolean = true;

  protected con: Condition;
  private _zcri: number;
  private srcValue: number;
  private destValue: number;

  protected _execute(): Promise<void> {
    return Promise.resolve();
  }

  protected roles: {
    src: RegisterRole;
    dest: RegisterRole;
  } = {
    src: { read: "value", write: "none" },
    dest: { read: "value", write: "value" },
  };

  constructor(
    public registerValue: number,
    public cog: Cog,
    public signedReads: boolean
  ) {
    const decoded = decomposeOpcode(registerValue);

    if (decoded === null) {
      throw new Error(`Invalid opcode: ${registerValue.toString(16)}`);
    }

    const { zcri, con, dest, src } = decoded;
    this.con = con;
    this._zcri = zcri;
    this.srcValue = src;
    this.destValue = dest;
    this.storeAddress = dest;
  }

  get src() {
    return this.srcOperand;
  }

  get dst() {
    return this.destOperand;
  }

  get res() {
    return this.result;
  }

  fetchDstOperand(): void {
    this.destOperand = this.cog.readURegister(this.destValue);
  }

  fetchSrcOperand(): void {
    if (this.iFlag) {
      this.srcOperand = this.srcValue;
    } else {
      this.srcOperand = this.cog.readURegister(this.srcValue);
    }
  }

  storeResult(): void {
    if (this.writeResult) {
      process.stderr.write(
        `  Writing result ${this.result & 0xffffffff} to ${
          this.storeAddress
        } (as ${this.signedReads ? "signed" : "unsigned"})\n`
      );
      if (this.signedReads) {
        this.cog.writeRegister(this.storeAddress, this.result & 0xffffffff);
      } else {
        this.cog.writeURegister(this.storeAddress, this.result & 0xffffffff);
      }
    }
  }

  getNextExpectedPC(): number {
    return (this.cog.pc + 1) & 0xfff;
  }

  get zcri() {
    return this._zcri;
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

  async performOperation(): Promise<void> {
    await this._execute();

    if (this.zFlag) {
      process.stderr.write(`  Setting Z flag\n`);
      this.setZ();
    }
    if (this.cFlag) {
      process.stderr.write(`  Setting C flag\n`);
      this.setC();
    }
  }
}
