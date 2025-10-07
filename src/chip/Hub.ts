import { BehaviorSubject } from "rxjs";
import { SystemClock } from "./SystemClock.js";
import type { MainRam } from "./MainRam.js";
import type { BaseOperation } from "../operation-implementations/BaseOperation.js";

type PendingHubOperation = {
  cogId: number;
  operation: BaseOperation;
  completion: {
    resolve: (value: void | Promise<void>) => void;
    reject: (reason?: any) => void;
  };
};

export class Hub {
  private currentCogId = new BehaviorSubject(0);
  private pendingOperations = new BehaviorSubject<
    Array<PendingHubOperation | undefined>
  >([]);

  get pendingOperations$() {
    return this.pendingOperations.asObservable();
  }

  constructor(
    systemClock: SystemClock,
    numCogs = 8,
    private mainRam: MainRam,
    public cogStatuses$: BehaviorSubject<boolean[]>
  ) {
    systemClock.tick$.subscribe({
      next: (tick) => {
        if (tick === 0 || tick % 2 === 1) return; // only every other tick
        this.currentCogId.next((this.currentCogId.value + 1) % numCogs);
      },
    });

    this.currentCogId.subscribe({
      next: (cogId) => {
        const pending = this.pendingOperations.value[cogId];
        if (pending) {
          pending.operation
            .performOperation()
            .then(() => {
              pending.completion.resolve();
              this.clearPendingOperation(cogId);
            })
            .catch((err) => {
              pending.completion.reject(err);
              this.clearPendingOperation(cogId);
            });
        }
      },
    });
  }

  private clearPendingOperation(cogId: number) {
    const current = [...this.pendingOperations.getValue()];
    current[cogId] = undefined;
    this.pendingOperations.next(current);
  }

  private setPendingOperation(
    cogId: number,
    operation: BaseOperation
  ): Promise<void> {
    const { promise, resolve, reject } = Promise.withResolvers<void>();
    const current = [...this.pendingOperations.getValue()];
    if (current.at(cogId) !== undefined) {
      throw new Error(`Cog ${cogId} already has a pending operation`);
    }
    process.stderr.write(`Setting pending operation for cog ${cogId}\n`);
    current[cogId] = {
      cogId,
      operation,
      completion: {
        resolve,
        reject,
      },
    };
    this.pendingOperations.next(current);
    return promise;
  }

  requestHubOperation(cogId: number, operation: BaseOperation): Promise<void> {
    return this.setPendingOperation(cogId, operation);
  }

  get currentHub$() {
    return this.currentCogId.asObservable();
  }

  get mainRamReader() {
    return this.mainRam;
  }
}
