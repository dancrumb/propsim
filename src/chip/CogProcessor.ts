import type { SystemClock } from "./SystemClock.js";
import { BehaviorSubject, combineLatest, type Observable } from "rxjs";
import type { Cog } from "./Cog.js";
import { NOPOperation } from "../operation-implementations/nop.js";
import type { CogPipeline } from "./CogPipeline.js";
import type { Operation } from "../Operation.js";

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
    ProcessorPhase.FetchDstOperand
  );

  private programCounter$: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);

  private log(message: string) {
    process.stderr.write(`[COG ${this.cog.id}]: ${message}\n`);
  }

  private processTick({ running }: { running: boolean }) {
    if (!running) {
      return;
    }
    const phase = this.currentPhase$.value;
    this.log(`In phase: ${ProcessorPhase[phase]}`);
    switch (phase) {
      case ProcessorPhase.FetchDstOperand: {
        const currentOperation = this.pipeline.currentOperation;
        if (currentOperation === null) {
          return;
        }
        this.currentOperation$.next(currentOperation);
        this.programCounter$.next(this.pipeline.readAheadPointer);
        this.currentOperation$.value.fetchDstOperand();
        this.currentPhase$.next(ProcessorPhase.FetchSrcOperand);
        break;
      }
      case ProcessorPhase.FetchSrcOperand: {
        this.currentOperation$.value.fetchSrcOperand();
        this.currentPhase$.next(ProcessorPhase.PerformOperation);
        break;
      }
      case ProcessorPhase.PerformOperation: {
        this.currentOperation$.value.performOperation().then(() => {
          this.currentPhase$.next(ProcessorPhase.StoreResult);
        });
        this.currentPhase$.next(ProcessorPhase.PerformingOperation);

        break;
      }
      case ProcessorPhase.StoreResult: {
        this.currentOperation$.value.storeResult();
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
