import type { PickKeys } from "ts-essentials";
import type { SystemCounter } from "./SystemCounter.js";

const SPECIAL_REGISTERS: Record<number, PickKeys<CogRegisters, number>> = {
  0x1f0: "par",
  0x1f1: "cnt",
  0x1f2: "ina",
  0x1f3: "inb",
  0x1f4: "outa",
  0x1f5: "outb",
  0x1f6: "dira",
  0x1f7: "dirb",
  0x1f8: "frqa",
  0x1f9: "frqb",
  0x1fa: "phsa",
  0x1fb: "phsb",
} as const;

export class CogRegisters {
  private _par: number = 0;
  private _ina: number = 0;
  private _inb: number = 0;
  private _outa: number = 0;
  private _outb: number = 0;
  private _dira: number = 0;
  private _dirb: number = 0;
  private _frqa: number = 0;
  private _frqb: number = 0;
  private _phsa: number = 0;
  private _phsb: number = 0;
  private _vcfg: number = 0;
  private _vscl: number = 0;

  constructor(private systemCounter: SystemCounter) {}

  private parSet: boolean = false;

  get par() {
    return this._par;
  }

  set par(value: number) {
    if (this.parSet) {
      throw new Error("PAR is readonly");
    }
    this._par = value;
    this.parSet = true;
  }

  get cnt(): number {
    return this.systemCounter.value;
  }

  get ina() {
    return this._ina;
  }

  get inb() {
    return this._inb;
  }

  get outa() {
    return this._outa;
  }

  set outa(value: number) {
    this._outa = value;
  }

  get outb() {
    return this._outb;
  }

  set outb(value: number) {
    this._outb = value;
  }

  get dira() {
    return this._dira;
  }

  set dira(value: number) {
    this._dira = value;
  }

  get dirb() {
    return this._dirb;
  }

  set dirb(value: number) {
    this._dirb = value;
  }

  get phsa() {
    return this._phsa;
  }

  set phsa(value: number) {
    this._phsa = value;
  }

  get phsb() {
    return this._phsb;
  }

  set phsb(value: number) {
    this._phsb = value;
  }

  get frqa() {
    return this._frqa;
  }

  set frqa(value: number) {
    this._frqa = value;
  }

  get frqb() {
    return this._frqb;
  }

  set frqb(value: number) {
    this._frqb = value;
  }

  get vcfg() {
    return this._vcfg;
  }

  set vcfg(value: number) {
    this._vcfg = value;
  }

  get vscl() {
    return this._vscl;
  }

  set vscl(value: number) {
    this._vscl = value;
  }

  readRegister(regNum: number): number {
    if (regNum < 0x1f0) {
      throw new Error("Invalid register address: " + regNum.toString(16));
    }
    return this[SPECIAL_REGISTERS[regNum]!];
  }

  writeRegister(regNum: number, value: number): void {
    if (regNum < 0x1f0) {
      throw new Error("Invalid register address: " + regNum.toString(16));
    }
    const regName = SPECIAL_REGISTERS[regNum];

    if (!regName) {
      throw new Error("Invalid register address: " + regNum.toString(16));
    }

    if (regName === "par" && this.parSet) {
      throw new Error("PAR is readonly");
    }
    if (regName === "cnt" || regName === "ina" || regName === "inb") {
      throw new Error("CNT is readonly");
    }
    this[regName] = value;
  }

  reset() {
    this.parSet = false;
    this._par = 0;
    this._ina = 0;
    this._inb = 0;
    this._outa = 0;
    this._outb = 0;
    this._dira = 0;
    this._dirb = 0;
    this._frqa = 0;
    this._frqb = 0;
    this._phsa = 0;
    this._phsb = 0;
    this._vcfg = 0;
    this._vscl = 0;
  }
}
