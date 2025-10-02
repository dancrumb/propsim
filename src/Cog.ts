import type { Hub } from "./Hub.js";
import type { SystemClock } from "./SystemClock.js";
import { CogRam } from "./CogRam.js";
import { CogRegisters } from "./CogRegisters.js";
import type { SystemCounter } from "./SystemCounter.js";
import { Gpio } from "./Gpio.js";
import { classicNameResolver } from "typescript";
import type { OpCode } from "./opcodes.js";
import type { Operation } from "./Operation.js";
import { decomposeOpcode } from "./decomposeOpcode.js";
import { BehaviorSubject } from "rxjs";

export class Cog {
  private pc = new BehaviorSubject(0);
  private ram = new CogRam();
  private registers: CogRegisters;
  private localGpio = new Gpio();
  private running: boolean = false;

  private pipelinePhase: "read" | "resolve" | "execute" | "writeback" = "read";

  private instructionRegister: number = 0;
  private currentOperation: Operation | null = null;

  constructor(
    private systemClock: SystemClock,
    private hub: Hub,
    systemCounter: SystemCounter,
    private gpio: Gpio,
    public readonly id: number
  ) {
    this.registers = new CogRegisters(systemCounter);
    this.systemClock.tick$.subscribe({
      next: () => {
        if (!this.running) return;
        switch (this.pipelinePhase) {
          case "read": {
            this.instructionRegister = this.ram.readURegister(
              this.pc.getValue()
            );
            this.pipelinePhase = "resolve";
            break;
          }
          case "resolve": {
            this.currentOperation = decomposeOpcode(this.instructionRegister);
            this.pipelinePhase = "execute";
            break;
          }
          case "execute": {
            this.pipelinePhase = "writeback";
            break;
          }
          case "writeback": {
            this.pc.next((this.pc.value + 1) & 0x1ff);
            this.pipelinePhase = "read";
            break;
          }
          default: {
            throw new Error(`Invalid pipeline phase: ${this.pipelinePhase}`);
          }
        }
        process.stderr.write(
          `[COG ${this.id}] Phase: ${this.pipelinePhase ?? "WTF"} PC: ${
            this.pc.value
          } (Running? ${this.running})\n`
        );
      },
    });
  }

  start(par: number, offset: number = 0) {
    this.registers.par = par;
    this.ram.loadFromRam(this.hub.mainRamReader, offset);
    this.running = true;
  }

  getRam() {
    return this.ram;
  }

  get pc$() {
    return this.pc.asObservable();
  }
}
