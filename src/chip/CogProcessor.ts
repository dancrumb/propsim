import { BehaviorSubject, combineLatest, type Observable } from "rxjs";
import type { Operation } from "../Operation.js";
import { NOPOperation } from "../operations/implementations/nop.js";
import { OperationFactory } from "../operations/OperationFactory.js";
import { h16 } from "../utils/val-display.js";
import type { Cog } from "./Cog.js";
import type { SystemClock } from "./SystemClock.js";

enum ProcessorPhase {
  FetchInstruction,
  DecodeInstruction,
  FetchDstOperand,
  FetchSrcOperand,
  PerformOperation,
  PerformingOperation,
  StoreResult,
}

/**
 * The CogProcessor represents the actual processing unit of a Cog
 */
export class CogProcessor {
  public readonly currentOperation$: BehaviorSubject<Operation | null>;

  private currentPhase$ = new BehaviorSubject<ProcessorPhase>(
    ProcessorPhase.FetchInstruction
  );

  private currentInstruction: number = 0;

  private programCounter$: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);

  private nextOperationPtr$ = new BehaviorSubject<number>(0);

  public readonly readAhead$: Observable<number> =
    this.nextOperationPtr$.asObservable();

  private debugLog(message: string) {
    if (this.cog.debug) {
      this.log(message);
    }
  }

  private log(message: string) {
    const currentOperation = this.currentOperation$.getValue();
    process.stderr.write(
      `[COG ${this.cog.id} | ${
        currentOperation?.constructor.name.replace("Operation", "") ?? "<none>"
      } <S: ${currentOperation?.src}> <D: ${currentOperation?.dst}> <R: ${
        currentOperation?.res
      }> ]: ${message}\n`
    );
  }

  private fetchInstruction() {
    const instLocation = this.nextOperationPtr$.getValue();
    this.debugLog(`Fetching instruction at ${instLocation}`);
    this.currentInstruction = this.cog.readRegister(instLocation) >>> 0;
  }

  private processTick({ running }: { running: boolean }) {
    if (!running) {
      return;
    }
    const currentOperation = this.currentOperation$.getValue();

    const phase = this.currentPhase$.value;
    this.debugLog(`In phase: ${ProcessorPhase[phase]}`);
    switch (phase) {
      case ProcessorPhase.FetchInstruction: {
        this.fetchInstruction();

        this.currentPhase$.next(ProcessorPhase.DecodeInstruction);
        break;
      }
      case ProcessorPhase.DecodeInstruction: {
        this.currentOperation$.next(
          OperationFactory.createOperation(this.currentInstruction, this.cog) ??
            new NOPOperation(this.currentInstruction, this.cog, false)
        );

        this.currentPhase$.next(ProcessorPhase.FetchDstOperand);
        break;
      }
      case ProcessorPhase.FetchDstOperand: {
        currentOperation?.fetchDstOperand();

        this.currentPhase$.next(ProcessorPhase.FetchSrcOperand);
        break;
      }
      case ProcessorPhase.FetchSrcOperand: {
        if (currentOperation !== null) {
          currentOperation.fetchSrcOperand();
          this.nextOperationPtr$.next(currentOperation.getNextExpectedPC());
        }

        this.currentPhase$.next(ProcessorPhase.PerformOperation);
        break;
      }
      case ProcessorPhase.PerformOperation: {
        this.fetchInstruction();

        if (currentOperation !== null) {
          let opComplete: Promise<void>;
          if (currentOperation.hubOperation) {
            opComplete = this.cog.hub.requestHubOperation(
              this.cog.id,
              currentOperation
            );
          } else {
            opComplete = currentOperation.performOperation();
          }
          opComplete.then(() => {
            this.currentPhase$.next(ProcessorPhase.StoreResult);
          });
          this.currentPhase$.next(ProcessorPhase.PerformingOperation);
        } else {
          this.currentPhase$.next(ProcessorPhase.StoreResult);
        }

        break;
      }
      case ProcessorPhase.PerformingOperation: {
        break;
      }
      case ProcessorPhase.StoreResult: {
        if (currentOperation !== null) {
          currentOperation.storeResult();
        }

        this.debugLog(`Current Instruction: ${h16(this.currentInstruction)}`);
        if (this.currentInstruction > 0) {
          this.programCounter$.next(this.nextOperationPtr$.getValue());
          this.currentOperation$.next(
            OperationFactory.createOperation(
              this.currentInstruction,
              this.cog
            ) ?? new NOPOperation(this.currentInstruction, this.cog, false)
          );
        } else {
          this.debugLog("Pipeline was reset");
          this.currentOperation$.next(null);
        }

        this.currentPhase$.next(ProcessorPhase.FetchDstOperand);
        break;
      }

      default: {
        throw new Error(
          `Invalid pipeline phase: ${this.currentPhase$.getValue()}`
        );
      }
    }
  }

  constructor(
    private cog: Cog,
    systemClock: SystemClock,
    running$: Observable<boolean>
  ) {
    this.currentOperation$ = new BehaviorSubject<Operation | null>(null);

    combineLatest({
      running: running$,
      clockTick: systemClock.tick$,
    }).subscribe({
      next: this.processTick.bind(this),
    });
  }

  get pc$(): Observable<number> {
    return this.programCounter$.asObservable();
  }

  set pc(newPC: number) {
    this.programCounter$.next(newPC & 0xfff);
  }

  readRegister(regNum: number): number {
    return this.cog.readRegister(regNum);
  }

  resetPipeline() {
    this.debugLog("Resetting pipeline");
    this.currentInstruction = 0;
    this.nextOperationPtr$.next(
      this.currentOperation$.value!.getNextExpectedPC()
    );
  }
}
