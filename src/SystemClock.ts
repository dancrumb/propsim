import { BehaviorSubject } from "rxjs";

export class SystemClock {
  private tickCount = 0;
  private tickSubject = new BehaviorSubject<number>(this.tickCount);
  public tick$ = this.tickSubject.asObservable();

  constructor() {}

  stepForward(ticks: number = 1) {
    this.tickCount += ticks;
    this.tickSubject.next(this.tickCount);
  }

  getTicks(): number {
    return this.tickCount;
  }
}
