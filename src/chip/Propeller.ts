import { MainRam } from "./MainRam.js";
import { SystemClock } from "./SystemClock.js";
import { Hub } from "./Hub.js";
import { Cog } from "./Cog.js";
import { SystemCounter } from "./SystemCounter.js";
import { SpinInterpreter } from "./SpinInterpreter.js";

const COG_COUNT = 8;

export class Propeller {
  public readonly mainRam: MainRam;
  public readonly systemClock = new SystemClock();
  public readonly systemCounter = new SystemCounter(this.systemClock);
  public readonly cogs: Array<Cog>;
  public readonly hub: Hub;
  private spinInterpreter: SpinInterpreter;

  constructor(binaryFilePath: string) {
    this.mainRam = new MainRam(binaryFilePath);
    this.hub = new Hub(this.systemClock, COG_COUNT, this.mainRam);

    this.cogs = Array.from(
      { length: COG_COUNT },
      (_, i) => new Cog(this.systemClock, this.hub, this.systemCounter, i)
    );

    this.spinInterpreter = new SpinInterpreter(this.mainRam, this.cogs);
  }

  /**
   * When we power on, we read the header of the binary
   */
  powerOn() {
    this.spinInterpreter.start();
  }
}
