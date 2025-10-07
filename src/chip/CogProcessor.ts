import type { SystemClock } from "./SystemClock.js";
import { OperationFactory } from "../operation-implementations/OperationFactory.js";
import { BehaviorSubject, type Observable } from "rxjs";
import type { PipelinePhase } from "./PipelinePhase.js";
import type { Cog } from "./Cog.js";
import { BaseOperation } from "../operation-implementations/BaseOperation.js";
import { NOPOperation } from "../operation-implementations/nop.js";

export class CogProcessor {
  private currentOperation$: BehaviorSubject<BaseOperation>;
  private instructionRegister: number = 0;
  private running: boolean = false;
  private pipelinePhase = new BehaviorSubject<PipelinePhase>("read");

  constructor(
    private cog: Cog,
    private systemClock: SystemClock,
    running$: Observable<boolean>
  ) {
    this.currentOperation$ = new BehaviorSubject<BaseOperation>(
      new NOPOperation(0, cog, false)
    );
    running$.subscribe((r) => (this.running = r));
    this.systemClock.tick$.subscribe({
      next: () => {
        if (!this.running) {
          return;
        }
        switch (this.pipelinePhase.value) {
          case "read": {
            this.instructionRegister = this.cog.readURegister(this.cog.pc);
            this.pipelinePhase.next("resolve");
            break;
          }
          case "resolve": {
            this.currentOperation$?.next(
              OperationFactory.createOperation(
                this.instructionRegister,
                this.cog
              ) ?? new NOPOperation(0, this.cog, false)
            );
            this.currentOperation$.value?.resolve();
            this.pipelinePhase.next("resolved");
            break;
          }
          case "resolved": {
            if (this.currentOperation$.value !== null) {
              this.pipelinePhase.next("executing");
              if (this.currentOperation$.value.hubOperation) {
                this.cog.hub.requestHubOperation(
                  this.cog.id,
                  this.currentOperation$.value
                );
                break;
              }
              this.currentOperation$?.value.execute().then(() => {
                this.pipelinePhase.next("writeback");
              });
            }
            break;
          }
          case "executing": {
            // waiting for execute to finish
            break;
          }
          case "writeback": {
            this.cog.setPC(
              this.currentOperation$.getValue()?.getNextInstructionLocation() ??
                0
            );
            this.pipelinePhase.next("read");
            break;
          }
          default: {
            throw new Error(
              `Invalid pipeline phase: ${this.pipelinePhase.getValue()}`
            );
          }
        }
        process.stderr.write(
          `[COG ${this.cog.id}] Phase: ${
            this.pipelinePhase.getValue() ?? "WTF"
          } PC: ${this.cog.pc} (Running? ${this.running})\n`
        );
      },
    });
  }

  readRegister(regNum: number): number {
    return this.cog.readURegister(regNum);
  }
}
