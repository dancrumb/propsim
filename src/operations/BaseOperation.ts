import type { Cog } from "../chip/Cog.js";
import type { Condition } from "../condition.js";
import { decodeOpcode } from "../opcodes/decodeOpcode.js";
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

export class BaseOperation implements Operation {
  protected srcOperand: number = 0;
  protected destOperand: number = 0;
  protected result: number = 0;
  protected storeAddress: number = 0;

  public readonly hubOperation: boolean = false;
  protected writeResult: boolean = true;

  protected con: Condition;
  private _zcri: number;
  protected srcValue: number;
  protected destValue: number;

  protected _execute(): Promise<void> {
    return Promise.resolve();
  }

  protected _complete() {}

  constructor(public registerValue: number, public cog: Cog) {
    const decoded = decodeOpcode(registerValue);

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
    this.destOperand = this.cog.readRegister(this.destValue);
  }

  fetchSrcOperand(): void {
    if (this.iFlag) {
      this.srcOperand = this.srcValue;
    } else {
      this.srcOperand = this.cog.readRegister(this.srcValue);
    }
  }

  storeResult(): void {
    if (this.writeResult) {
      this.cog.writeRegister(this.storeAddress, this.result >>> 0);
    }
    if (this._complete) {
      this._complete();
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
      this.setZ();
    }
    if (this.cFlag) {
      this.setC();
    }
  }
}
