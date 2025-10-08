import type { Hub } from "./Hub.js";
import type { SystemClock } from "./SystemClock.js";
import { CogRam } from "./CogRam.js";
import { CogRegisters } from "./CogRegisters.js";
import type { SystemCounter } from "./SystemCounter.js";

import { CogFlags } from "./CogFlags.js";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { h16 } from "../utils/val-display.js";
import type { PipelinePhase } from "./PipelinePhase.js";
import { CogProcessor } from "./CogProcessor.js";

export class Cog {
  private _pc = new BehaviorSubject(0);
  private ram = new CogRam();
  private registers: CogRegisters;
  public readonly running$ = new BehaviorSubject<boolean>(false);
  private flags = new CogFlags();

  public readonly flags$: Observable<{ Z: boolean; C: boolean }>;

  private pipelinePhase = new BehaviorSubject<PipelinePhase>("read");

  private instructionRegister: number = 0;

  private processor: CogProcessor;

  get currentOperation$() {
    return this.processor.currentOperation$.asObservable();
  }

  get nextOperation$() {
    return this.processor.nextOperation$.asObservable();
  }

  constructor(
    systemClock: SystemClock,
    public readonly hub: Hub,
    systemCounter: SystemCounter,
    public readonly id: number
  ) {
    this.registers = new CogRegisters(systemCounter);
    this.processor = new CogProcessor(this, systemClock, this.running$);

    this.flags$ = combineLatest({ Z: this.flags.Z$, C: this.flags.C$ });
  }

  private log(message: string) {
    process.stderr.write(`[COG ${this.id}] ${message}\n`);
  }

  start(par: number, address: number = 0) {
    this.log(`Starting at address ${h16(address)} and parameter ${par}`);
    this.registers.par = par;
    this.ram.loadFromRam(this.hub.mainRamReader, address);
    this.running$.next(true);
  }

  stop() {
    process.stderr.write(`[COG ${this.id}] Stopping\n`);
    this.running$.next(false);
  }

  getRam() {
    return this.ram;
  }

  get pc$() {
    return this._pc.asObservable();
  }

  isRunning() {
    return this.running$.getValue();
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
    const newPC = value & 0x1ff;
    this.log(`Setting PC from ${this._pc.getValue()} to ${newPC}`);
    this._pc.next(newPC);
  }

  updateZFlag(set: boolean) {
    this.flags.Z = set;
  }
  updateCFlag(set: boolean) {
    this.flags.C = set;
  }

  get Z() {
    return this.flags.Z;
  }

  get C() {
    return this.flags.C;
  }
}
