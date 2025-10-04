import type { Hub } from "./Hub.js";
import type { SystemClock } from "./SystemClock.js";
import { CogRam } from "./CogRam.js";
import { CogRegisters } from "./CogRegisters.js";
import type { SystemCounter } from "./SystemCounter.js";

import { BehaviorSubject } from "rxjs";
import { CogFlags } from "./CogFlags.js";
import { OperationFactory } from "./operation-implementations/OperationFactory.js";
import type { BaseOperation } from "./operation-implementations/BaseOperation.js";

type PipelinePhase =
  | "read"
  | "resolve"
  | "resolved"
  | "executing"
  | "writeback";

export class Cog {
  private _pc = new BehaviorSubject(0);
  private ram = new CogRam();
  private registers: CogRegisters;
  private running: boolean = false;
  private flags = new CogFlags();

  private pipelinePhase = new BehaviorSubject<PipelinePhase>("read");

  private instructionRegister: number = 0;
  public readonly currentOperation$ = new BehaviorSubject<BaseOperation | null>(
    null
  );

  constructor(
    private systemClock: SystemClock,
    private hub: Hub,
    systemCounter: SystemCounter,
    public readonly id: number
  ) {
    this.registers = new CogRegisters(systemCounter);
    this.systemClock.tick$.subscribe({
      next: () => {
        if (!this.running) return;
        switch (this.pipelinePhase.value) {
          case "read": {
            this.instructionRegister = this.ram.readURegister(
              this._pc.getValue()
            );
            this.pipelinePhase.next("resolve");
            break;
          }
          case "resolve": {
            this.currentOperation$?.next(
              OperationFactory.createOperation(this.instructionRegister, this)
            );
            this.pipelinePhase.next("resolved");
            break;
          }
          case "resolved": {
            if (this.currentOperation$?.value !== null) {
              this.pipelinePhase.next("executing");
              this.currentOperation$?.value.execute().then(() => {
                this.pipelinePhase.next("writeback");
              });
            }
            break;
          }
          case "writeback": {
            this.currentOperation$?.value?.updatePC();
            this.pipelinePhase.next("read");
            break;
          }
          default: {
            throw new Error(`Invalid pipeline phase: ${this.pipelinePhase}`);
          }
        }
        process.stderr.write(
          `[COG ${this.id}] Phase: ${this.pipelinePhase ?? "WTF"} PC: ${
            this._pc.value
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
    return this._pc.asObservable();
  }

  isRunning() {
    return this.running;
  }

  readRegister(index: number) {
    if (index >= 0x1f0) {
      return this.registers.readRegister(index);
    }
    return this.ram.readRegister(index);
  }

  readURegister(index: number) {
    if (index >= 0x1f0) {
      return this.registers.readRegister(index);
    }
    return this.ram.readURegister(index);
  }

  writeRegister(index: number, value: number) {
    if (index >= 0x1f0) {
      this.registers.writeRegister(index, value);
    } else {
      this.ram.writeRegister(index, value);
    }
  }

  writeURegister(index: number, value: number) {
    if (index >= 0x1f0) {
      this.registers.writeRegister(index, value);
    } else {
      this.ram.writeURegister(index, value);
    }
  }

  get pc() {
    return this._pc.getValue();
  }

  setPC(value: number) {
    this._pc.next(value & 0x1ff);
  }

  updateZFlag(set: boolean) {
    this.flags.Z = set;
  }
  updateCFlag(set: boolean) {
    this.flags.C = set;
  }
}
