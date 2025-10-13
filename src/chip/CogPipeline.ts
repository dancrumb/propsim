import { BehaviorSubject, Observable } from "rxjs";
import type { Operation } from "../Operation.js";
import { NOPOperation } from "../operations/implementations/nop.js";
import { OperationFactory } from "../operations/OperationFactory.js";
import type { Cog } from "./Cog.js";
import type { SystemClock } from "./SystemClock.js";

enum PipelinePhase {
  ReadInstruction,
  DecodeInstruction,
  UpdatePointer,
  UpdatePC,
}

/**
 * The CogPipeline represents the instruction pipeline that is inferred in *Programming the Parallax Propeller using Machine Language* by deSilva
 * @link https://www.rayslogic.com/propeller/programming/DeSilvaAssemblyTutorial.pdf
 *
 * It retains a look-ahead pointer and pre-loads the "next" instruction in the program.
 *
 * It is driven by the system clock.
 *
 * From an architectural perspective, this acts as a pull source of data; it does not modify anything external to itself
 */
export class CogPipeline {
  public running: boolean = false;
  private currentInstruction: number = 0;
  private currentOperation$: BehaviorSubject<Operation | null> =
    new BehaviorSubject<Operation | null>(null);
  private pointer = new BehaviorSubject<number>(0);

  public readAheadPointer$: Observable<number>;

  public readonly currentPhase$ = new BehaviorSubject<PipelinePhase>(
    PipelinePhase.ReadInstruction
  );

  private log(message: string) {
    process.stderr.write(
      `[PIP ${this.cog.id} | ${
        this.currentOperation?.constructor.name.replace("Operation", "") ??
        "<none>"
      } <S: ${this.currentOperation?.src}> <D: ${
        this.currentOperation?.dst
      }> <R: ${this.currentOperation?.res}> ]: ${message}\n`
    );
  }

  private processTick() {
    if (!this.running) {
      return;
    }
    this.log(`Processing phase ${PipelinePhase[this.currentPhase$.value]}`);
    switch (this.currentPhase$.value) {
      case PipelinePhase.ReadInstruction: {
        this.currentInstruction = this.cog.readURegister(
          this.pointer.getValue()
        );
        this.currentPhase$.next(PipelinePhase.DecodeInstruction);
        break;
      }
      case PipelinePhase.DecodeInstruction: {
        this.currentOperation$.next(
          OperationFactory.createOperation(this.currentInstruction, this.cog) ??
            new NOPOperation(this.currentInstruction, this.cog, false)
        );
        this.log(
          `Decoded instruction ${this.currentOperation$.value?.constructor.name}`
        );
        this.currentPhase$.next(PipelinePhase.UpdatePointer);
        break;
      }
      case PipelinePhase.UpdatePointer: {
        const op = this.currentOperation;
        if (op === null) {
          throw new Error("No current operation in UpdatePointer phase");
        }
        this.pointer.next(op.getNextExpectedPC());
        this.currentPhase$.next(PipelinePhase.UpdatePC);
        break;
      }
      case PipelinePhase.UpdatePC: {
        // this.processor.pc = this.pointer.value;
        this.currentPhase$.next(PipelinePhase.ReadInstruction);
        break;
      }
    }
  }

  constructor(private cog: Cog, systemClock: SystemClock) {
    systemClock.tick$.subscribe(() => {
      this.processTick();
    });

    this.readAheadPointer$ = this.pointer.asObservable();
  }

  get readAheadPointer() {
    return this.pointer.getValue();
  }

  get currentOperation() {
    return this.currentOperation$.getValue();
  }

  waitForSync() {
    this.running = false;
    this.currentInstruction = 0;
    this.currentOperation$.next(null);
  }

  sync() {
    this.running = true;
  }
}
