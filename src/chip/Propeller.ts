import { BehaviorSubject } from "rxjs";
import { inkLog } from "../ink-log.js";
import { Cog } from "./Cog.js";
import { Hub } from "./Hub.js";
import { MainRam } from "./MainRam.js";
import { SpinInterpreter } from "./SpinInterpreter.js";
import { SystemClock } from "./SystemClock.js";
import { SystemCounter } from "./SystemCounter.js";

const COG_COUNT = 8;

export class Propeller {
  public readonly mainRam: MainRam;
  public readonly systemClock = new SystemClock();
  public readonly systemCounter = new SystemCounter(this.systemClock);
  public readonly cogs: Array<Cog>;
  public readonly hub: Hub;
  private spinInterpreter: SpinInterpreter;

  public readonly clockFrequency: number;
  public readonly initialClk: number;
  public readonly programBase: number;
  public readonly variableBase: number;
  public readonly stackBase: number;
  public readonly pCurr: number;
  public readonly dCurr: number;

  constructor(binaryFilePath: string) {
    this.mainRam = new MainRam(binaryFilePath);
    /*
     * This array keeps track of the running status of each cog
     */
    const cogStatuses$ = new BehaviorSubject(
      Array.from({ length: COG_COUNT }, () => false)
    );

    this.hub = new Hub(this.systemClock, COG_COUNT, this.mainRam, cogStatuses$);
    const cogs = Array.from(
      { length: COG_COUNT },
      (_, i) => new Cog(this.systemClock, this.hub, this.systemCounter, i)
    );

    /*
     * Here's where we update the running status of each cog
     */
    cogs.forEach((cog) => {
      cog.running$.subscribe((isRunning) =>
        cogStatuses$.next(cogStatuses$.value.toSpliced(cog.id, 0, isRunning))
      );
    });

    this.cogs = cogs;

    this.spinInterpreter = new SpinInterpreter(this.mainRam, this.cogs);

    this.clockFrequency = this.hub.mainRamReader.readLong(0);
    this.initialClk = this.hub.mainRamReader.readByte(4);
    this.programBase = this.hub.mainRamReader.readWord(6);
    this.variableBase = this.hub.mainRamReader.readWord(8);
    this.stackBase = this.hub.mainRamReader.readWord(10);
    this.pCurr = this.hub.mainRamReader.readWord(12);
    this.dCurr = this.hub.mainRamReader.readWord(14);

    inkLog(`
Clock Frequency:  ${this.clockFrequency}
Initial CLK:      ${this.initialClk}
PBASE:            ${this.programBase}
VBASE:            ${this.variableBase}
DBASE:            ${this.stackBase}
PCURR             ${this.pCurr}
DCURR:            ${this.dCurr}`);
  }

  /**
   * When we power on, we read the header of the binary
   */
  powerOn() {
    this.spinInterpreter.start();
  }
}
