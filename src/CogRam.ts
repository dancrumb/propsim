import type { MainRam } from "./MainRam.js";

export class CogRam {
  private buf: Buffer = Buffer.alloc(32 * 496);
  constructor() {}

  loadFromRam(ram: MainRam, offset = 0) {
    for (let i = 0; i < 32 * 496; i++) {
      this.buf[i] = ram.readByte(i + offset);
    }
  }

  readURegister(address: number): number {
    return this.buf.readUInt32LE(address * 4);
  }

  readRegister(address: number): number {
    return this.buf.readInt32LE(address * 4);
  }

  writeURegister(address: number, value: number) {
    this.buf.writeUInt32LE(value, address * 4);
  }

  writeRegister(address: number, value: number) {
    this.buf.writeInt32LE(value, address * 4);
  }
}
