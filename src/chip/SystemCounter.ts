import { SystemClock } from "./SystemClock.js";

export class SystemCounter {
  private count: number = 0;
  constructor(systemClock: SystemClock) {
    systemClock.tick$.subscribe(() => {
      this.increment();
    });
  }

  get value() {
    return this.count;
  }

  increment() {
    this.count++;
    if (this.count > 0xffffffff) {
      this.count = 0;
    }
  }
}
