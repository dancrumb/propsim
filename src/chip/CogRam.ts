import type { MainRam } from "./MainRam.js";

export class CogRam {
  private buf: Buffer = Buffer.alloc(32 * 496);
  constructor(private debug?: boolean) {}

  private log(message: string) {
    if (this.debug) {
      process.stderr.write(`[CogRam]: ${message}\n`);
    }
  }

  loadFromRam(ram: MainRam, offset = 0) {
    for (let i = 0; i < 32 * 496; i++) {
      this.buf[i] = ram.readByte(i + offset);
    }
  }

  readRegister(address: number): number {
    return this.buf.readUInt32LE(address * 4);
  }

  writeRegister(address: number, value: number) {
    this.log(`Writing ${value} to ${address}`);
    this.buf.writeUInt32LE(value >>> 0, address * 4);
  }
}
