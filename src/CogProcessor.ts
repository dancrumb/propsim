import { CogRam } from "./CogRam.js";
import { CogRegisters } from "./CogRegisters.js";
import { decomposeOpcode } from "./decomposeOpcode.js";
import type { Operation } from "./Operation.js";
import type { SystemClock } from "./SystemClock.js";
import type { SystemCounter } from "./SystemCounter.js";

const processOperation = (operation: Operation) => Promise.resolve(1);

export class CogProcessor {
  private programCounter: number = 0;
  private cogRegisters: CogRegisters;
  private currentOperation: Operation | null = null;

  constructor(
    private ram: CogRam,
    private systemClock: SystemClock,
    systemCounter: SystemCounter
  ) {
    this.cogRegisters = new CogRegisters(systemCounter);
    this.systemClock.tick$.subscribe({
      next: (tick) => {
        this.executeCycle();
      },
    });
  }

  executeCycle() {
    if (this.currentOperation === null) {
      const opcode = this.ram.readURegister(this.programCounter);
      this.currentOperation = decomposeOpcode(opcode);
      if (this.currentOperation === null) {
        throw new Error(
          `Invalid opcode at ${this.programCounter.toString(16)}`
        );
      }
      processOperation(this.currentOperation).then(() => {
        this.programCounter += 1;
        this.currentOperation = null;
      });
    }
  }

  readRegister(regNum: number): number {
    if (regNum < 0x1f0) {
      return this.ram.readURegister(regNum);
    }
    return this.cogRegisters.readRegister(regNum);
  }
}
