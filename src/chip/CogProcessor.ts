import { BehaviorSubject, combineLatest, type Observable } from "rxjs";
import type { Operation } from "../Operation.js";
import { NOPOperation } from "../operations/implementations/nop.js";
import type { Cog } from "./Cog.js";
import type { CogPipeline } from "./CogPipeline.js";
import type { SystemClock } from "./SystemClock.js";

enum ProcessorPhase {
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
  public readonly currentOperation$: BehaviorSubject<Operation>;

  private currentPhase$ = new BehaviorSubject<ProcessorPhase>(
    ProcessorPhase.FetchSrcOperand
  );

  private programCounter$: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);

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

  private processTick({ running }: { running: boolean }) {
    if (!running) {
      return;
    }
    const currentOperation = this.pipeline.currentOperation;
    if (currentOperation === null) {
      return;
    }
    const phase = this.currentPhase$.value;
    this.log(`In phase: ${ProcessorPhase[phase]}`);
    switch (phase) {
      case ProcessorPhase.FetchSrcOperand: {
        this.currentOperation$.next(currentOperation);
        this.currentOperation$.value.fetchSrcOperand();
        this.programCounter$.next(this.pipeline.readAheadPointer);

        this.currentPhase$.next(ProcessorPhase.FetchDstOperand);
        break;
      }
      case ProcessorPhase.FetchDstOperand: {
        this.currentOperation$.value.fetchDstOperand();
        this.currentPhase$.next(ProcessorPhase.PerformOperation);
        break;
      }
      case ProcessorPhase.PerformOperation: {
        let opComplete: Promise<void>;
        if (this.currentOperation$.value.hubOperation) {
          this.cog.holdPipeline();

          opComplete = this.cog.hub.requestHubOperation(
            this.cog.id,
            this.currentOperation$.value
          );
        } else {
          opComplete = this.currentOperation$.value.performOperation();
        }
        opComplete.then(() => {
          if (this.currentOperation$.value.hubOperation) {
            this.cog.syncPipeline();
          }
          this.currentPhase$.next(ProcessorPhase.StoreResult);
        });
        this.currentPhase$.next(ProcessorPhase.PerformingOperation);

        break;
      }
      case ProcessorPhase.PerformingOperation: {
        break;
      }
      case ProcessorPhase.StoreResult: {
        this.currentOperation$.value.storeResult();
        this.currentPhase$.next(ProcessorPhase.FetchSrcOperand);

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
    private pipeline: CogPipeline,
    running$: Observable<boolean>
  ) {
    this.currentOperation$ = new BehaviorSubject<Operation>(
      new NOPOperation(0, cog, false)
    );

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
    return this.cog.readURegister(regNum);
  }
}
