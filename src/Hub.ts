import { BehaviorSubject } from "rxjs";
import { SystemClock } from "./SystemClock.js";
import type { MainRam } from "./MainRam.js";

export class Hub {
  private currentHub = new BehaviorSubject(0);
  private pendingOperations: Array<() => void> = [];

  constructor(systemClock: SystemClock, numCogs = 8, private mainRam: MainRam) {
    systemClock.tick$.subscribe({
      next: (tick) => {
        if (tick === 0 || tick % 2 === 1) return; // only every other tick
        this.currentHub.next((this.currentHub.value + 1) % numCogs);
      },
    });
  }

  requestHubOperation(cogId: number, operation: () => void) {
    if (this.pendingOperations.at(cogId) !== undefined) {
      throw new Error(`Cog ${cogId} already has a pending operation`);
    }
    this.pendingOperations[cogId] = operation;
  }

  get currentHub$() {
    return this.currentHub.asObservable();
  }

  get mainRamReader() {
    return this.mainRam;
  }
}
