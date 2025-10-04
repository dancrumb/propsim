import { readFileSync } from "node:fs";

export class MainRam {
  private buf: Buffer = Buffer.alloc(32 * 8196);
  constructor(private filename: string) {
    const fileBuf = readFileSync(this.filename, null);
    if (fileBuf.length > this.buf.length) {
      throw new Error("File too large for MainRam");
    }
    fileBuf.copy(this.buf);
  }

  readByte(address: number): number {
    return this.buf.readUInt8(address);
  }

  readWord(address: number): number {
    return this.buf.readUInt16LE(address & 0xfe);
  }

  readLong(address: number): number {
    return this.buf.readUInt32LE(address & 0xfc);
  }
}
