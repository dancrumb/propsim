import { BehaviorSubject } from "rxjs";
import { Cog } from "../../src/chip/Cog";
import { Hub } from "../../src/chip/Hub";
import { MainRam } from "../../src/chip/MainRam";
import { SystemClock } from "../../src/chip/SystemClock";
import { SystemCounter } from "../../src/chip/SystemCounter";

export const getTestCog = () => {
  const clock = new SystemClock();
  const counter = new SystemCounter(clock);
  const hub = new Hub(
    clock,
    1,
    new MainRam("NUL"),
    new BehaviorSubject([true] as boolean[])
  );
  const cog = new Cog(clock, hub, counter, 0);

  return cog;
};
