import type { SystemClock } from "./SystemClock.js";
import type { SystemCounter } from "./SystemCounter.js";
import type { PickKeys } from "ts-essentials";

const SPECIAL_REGISTERS: Record<number, PickKeys<CogRegisters, number>> = {
  0x1f0: "par",
  0x1f1: "cnt",
} as const;

export class CogRegisters {
  private _par: number = 0;
  private ina: number = 0;
  private inb: number = 0;
  private outa: number = 0;
  private outb: number = 0;
  private dira: number = 0;
  private dirb: number = 0;
  private frqa: number = 0;
  private frqb: number = 0;
  private phsa: number = 0;
  private phsb: number = 0;
  private vcfg: number = 0;
  private vscl: number = 0;

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

  readRegister(regNum: number): number {
    if (regNum < 0x1f0) {
      throw new Error("Invalid register address: " + regNum.toString(16));
    }
    return this[SPECIAL_REGISTERS[regNum]!];
  }

  reset() {
    this.parSet = false;
  }
}
