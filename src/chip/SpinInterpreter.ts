import { h16, h8 } from "../utils/val-display.js";
import type { Cog } from "./Cog.js";
import type { MainRam } from "./MainRam.js";

const SPIN_OPERATIONS = {
  0x32: "ret",
  0x34: "ldlim1", // LoaD Long Immediate -1
  0x35: "ldli0", // LoaD Long Immediate 0
  0x36: "ldli1", // LoaD Long Immediate 1
  0x37: "ldlip", // LoaD Long Immediate Positive
  0x38: "ldbi", // LoaD Byte Immediate
  0x2c: "coginit",
  0xc7: "lalo", // LoaD Address Long Offset
};

export class SpinInterpreter {
  private pCurr: number = 0;
  private pBase: number = 0;
  private dCurr: number = 0;
  private vBase: number = 0;
  private dBase: number = 0;

  constructor(private mainRam: MainRam, private cogs: Cog[]) {
    this.pBase = this.mainRam.readWord(0x06);
    this.vBase = this.mainRam.readWord(0x08);
    this.dBase = this.mainRam.readWord(0x0a);
    this.pCurr = this.mainRam.readWord(0x0c);
    this.dCurr = this.mainRam.readWord(0x0e);
  }

  private pushLong(val: number) {
    process.stderr.write(
      `  Writing data long ${h16(val)} at ${h16(this.dCurr)}\n`
    );
    this.mainRam.writeLong(this.dCurr, val);
    this.dCurr += 4;
  }

  private popLong(): number {
    this.dCurr -= 4;
    const val = this.mainRam.readLong(this.dCurr);
    process.stderr.write(
      `  Reading data long ${h16(val)} from ${h16(this.dCurr)}\n`
    );
    return val;
  }

  start() {
    let dCurr = this.dCurr;
    let pCurr = this.pCurr;

    interp: while (true) {
      const spinOpCode = this.mainRam.readByte(pCurr++);
      const spinOp =
        SPIN_OPERATIONS[spinOpCode as keyof typeof SPIN_OPERATIONS];
      if (!spinOp) {
        throw new Error(
          `Unsupported initial SPIN code. Unknown opcode ${h8(
            spinOpCode
          )} at offset ${h16(pCurr)}`
        );
      }

      process.stderr.write(
        `Interpreting SPIN op ${spinOp} at address ${h16(pCurr)}; dCurr=${h16(
          dCurr
        )}\n`
      );
      switch (spinOp) {
        case "lalo": {
          const memfunc = spinOpCode & 3;
          let memsize = 0;
          let membase = 0;
          let memaddr = 0;

          if (spinOpCode < 0x80) {
            memsize = 3;
            memaddr = spinOpCode & 0x1c;
            membase = (spinOpCode >> 5) & 3;
          } else {
            memsize = ((spinOpCode >> 5) & 3) - 1;
            membase = (spinOpCode & 0x0c) >> 2;

            if (spinOpCode & 0x10) {
              dCurr -= 4;
              memaddr = this.mainRam.readLong(dCurr) << (memsize - 1);
            } else {
              memaddr = 0;
            }

            if (membase !== 0) {
              memaddr += this.mainRam.readByte(pCurr++);
            } else {
              dCurr -= 4;
              memaddr += this.mainRam.readLong(dCurr);
            }
          }
          if (membase === 1) {
            memaddr += this.pBase;
          } else if (membase === 2) {
            memaddr += this.vBase;
          } else if (membase === 3) {
            memaddr += this.dBase;
          }

          process.stderr.write(
            `  LALO with memfunc=${memfunc} memsize=${memsize} membase=${membase} memaddr=${h16(
              memaddr
            )}; dcurr = ${h16(dCurr)}, pBase = ${h16(this.pBase)}\n`
          );

          if (memfunc === 3) {
            this.pushLong(memaddr);
          } else if (memfunc === 0) {
            if (memsize === 1) {
              this.pushLong(this.mainRam.readByte(memaddr));
            } else if (memsize === 2) {
              this.pushLong(this.mainRam.readWord(memaddr));
            } else {
              this.pushLong(this.mainRam.readLong(memaddr));
            }
          } else {
            throw new Error("Operation not supported");
          }
          break;
        }
        case "ldlim1":
          this.pushLong(-1);
          break;
        case "ldli0":
          this.pushLong(0);
          break;
        case "ldli1":
          this.pushLong(1);
          break;
        case "ldlip": {
          let val = 0;
          const operand = this.mainRam.readByte(pCurr++);
          const rotate = operand & 31;
          if (rotate === 31) {
            val = 1;
          } else {
            val = 2 << rotate;
          }
          if ((operand & 0x20) !== 0) {
            val--;
          }
          if ((operand & 0x40) !== 0) {
            val = -val;
          }
          this.pushLong(val);
          break;
        }
        case "ldbi": {
          const operand = this.mainRam.readByte(pCurr++);
          this.pushLong(operand);
          break;
        }
        case "coginit": {
          // We should have 3 values on the stack: cogId, asmStart, parVal
          const parVal = this.popLong();
          const asmStart = this.popLong();
          let cogId = this.popLong();

          // CogID is the value in the first byte, offset by pCurr and minus 1.
          // If it's negative, we
          if (cogId < 0 || cogId > 7) {
            cogId = this.cogs.findIndex((cog) => !cog.isRunning());
          }

          process.stderr.write(
            `Starting COG ${cogId} at address ${h16(
              asmStart
            )} with parameter ${parVal}\n`
          );
          const cog = this.cogs[cogId];
          if (!cog) {
            throw new Error(`Invalid COG ID: ${cogId}`);
          }
          cog.start(parVal, asmStart);
          // Derived from https://github.com/parallaxinc/spinsim/blob/77f7331974de88e18c69a90f450feb70a979979c/spininterp.c#L668
          break;
        }
        case "ret":
          // Just stop processing SPIN code when we hit a RET
          break interp;
      }
    }
  }
}
