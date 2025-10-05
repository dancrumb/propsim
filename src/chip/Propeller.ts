import { MainRam } from "./MainRam.js";
import { SystemClock } from "./SystemClock.js";
import { Hub } from "./Hub.js";
import { Cog } from "./Cog.js";
import { SystemCounter } from "./SystemCounter.js";
import { h8 } from "../utils/val-display.js";

const COG_COUNT = 8;

export class Propeller {
  public readonly mainRam: MainRam;
  public readonly systemClock = new SystemClock();
  public readonly systemCounter = new SystemCounter(this.systemClock);
  public readonly cogs: Array<Cog>;
  public readonly hub: Hub;

  private pCurr: number = 0;
  private pBase: number = 0;

  constructor(binaryFilePath: string) {
    this.mainRam = new MainRam(binaryFilePath);
    this.hub = new Hub(this.systemClock, COG_COUNT, this.mainRam);

    this.cogs = Array.from(
      { length: COG_COUNT },
      (_, i) => new Cog(this.systemClock, this.hub, this.systemCounter, i)
    );
  }

  /**
   * This is really just a kludge to handle an initial COGINIT call
   *
   * I reverse-engineered the Spin COGINIT call as best I could, so there's a change that this has some unexpected failure modes.
   */
  private interpretInitialSpin() {
    const spinCode: [
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number
    ] = Array.from({ length: 8 }, () => 0) as any;

    for (let i = 0; i < 8; i++) {
      spinCode[i] = this.mainRam.readByte(this.pCurr + i);
    }
    process.stderr.write(
      `Initial SPIN code: ${[...spinCode].map((n) => h8(n)).join(":")}\n`
    );

    /**
     * As far as I can tell, the 0x2C byte indicates a COGINIT instruction.
     */
    if (spinCode[5] !== 0x2c) {
      throw new Error("Unsupported initial SPIN code. Expecting COGINIT");
    }

    // CogID is the value in the first byte, offset by pCurr and minus 1.
    // If it's negative, we need to find the first non-running COG.
    let cogId = (spinCode[0] >>> 0) - this.pCurr - 1;
    if (cogId < 0) {
      cogId = this.cogs.findIndex((cog) => !cog.isRunning());
    }

    // The start address is in the 3rd byte, and the parameter is in the 5th byte.
    const asmStart = spinCode[2] >>> 0;
    const parVal = spinCode[4] >>> 0;

    process.stderr.write(
      `Starting COG ${cogId} at offset ${asmStart} with parameter ${parVal}\n`
    );
    const cog = this.cogs[cogId];
    if (!cog) {
      throw new Error(`Invalid COG ID: ${cogId}`);
    }
    cog.start(parVal, asmStart + this.pBase);
  }

  /**
   * When we power on, we read the header of the binary
   */
  powerOn() {
    const clkFreq = this.mainRam.readLong(0x0);
    const clkMode = this.mainRam.readByte(0x4);
    const checkSum = this.mainRam.readLong(0x5);
    this.pBase = this.mainRam.readWord(0x06);
    const vbase = this.mainRam.readWord(0x08);
    const dBase = this.mainRam.readWord(0x0a);
    this.pCurr = this.mainRam.readWord(0x0c);
    const dCurr = this.mainRam.readWord(0x0e);

    this.interpretInitialSpin();

    return {
      clkFreq,
      clkMode,
      checkSum,
      pBase: this.pBase,
      vbase,
      dBase,
      pCurr: this.pCurr,
      dCurr,
    };
  }
}
