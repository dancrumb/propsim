import EventEmitter from "node:events";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import type { Operation } from "../Operation.js";
import { h16 } from "../utils/val-display.js";
import { CogFlags } from "./CogFlags.js";
import { CogPipeline } from "./CogPipeline.js";
import { CogProcessor } from "./CogProcessor.js";
import { CogRam } from "./CogRam.js";
import { CogRegisters } from "./CogRegisters.js";
import type { Hub } from "./Hub.js";
import type { SystemClock } from "./SystemClock.js";
import type { SystemCounter } from "./SystemCounter.js";

export class Cog extends EventEmitter {
  private ram = new CogRam();
  private registers: CogRegisters;
  public readonly running$ = new BehaviorSubject<boolean>(false);
  private flags = new CogFlags();

  public readonly flags$: Observable<{ Z: boolean; C: boolean }>;

  private processor: CogProcessor;
  private pipeline: CogPipeline;

  public readonly pc$: Observable<number>;
  public readonly currentOperation$: Observable<Operation>;

  private programCounter$ = new BehaviorSubject<number>(0);

  constructor(
    systemClock: SystemClock,
    public readonly hub: Hub,
    systemCounter: SystemCounter,
    public readonly id: number
  ) {
    super();

    this.registers = new CogRegisters(systemCounter);
    this.pipeline = new CogPipeline(this, systemClock);
    this.processor = new CogProcessor(
      this,
      systemClock,
      this.pipeline,
      this.running$
    );

    systemClock.tick$.subscribe(() => {
      this.emit("tick");
    });

    this.flags$ = combineLatest({ Z: this.flags.Z$, C: this.flags.C$ });

    this.processor.pc$.subscribe((pc) => this.programCounter$.next(pc));

    this.pc$ = this.programCounter$.asObservable();
    this.currentOperation$ = this.processor.currentOperation$.asObservable();

    this.running$.subscribe((isRunning) => {
      this.pipeline.running = isRunning;
    });
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
    return this.programCounter$.getValue();
  }

  get readAhead$() {
    return this.pipeline.readAheadPointer$;
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

  holdPipeline() {
    this.pipeline.waitForSync();
  }

  syncPipeline() {
    this.pipeline.sync();
  }
}
