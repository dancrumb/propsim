import { ObservableBuffer } from "../ObservableBuffer.js";
import type { MainRam } from "./MainRam.js";

export class CogRam {
  private buf: ObservableBuffer = new ObservableBuffer(32 * 496);
  constructor(private cogId: number, private debug?: boolean) {}

  private log(message: string) {
    if (this.debug) {
      process.stderr.write(`[CogRam]: ${message}\n`);
    }
  }

  loadFromRam(ram: MainRam, offset = 0) {
    for (let i = 0; i < 32 * 496; i++) {
      this.buf.put(i, ram.readByte(i + offset));
    }
  }

  readRegister(address: number): number {
    return this.buf.readUInt32LE(address * 4);
  }

  writeRegister(address: number, value: number) {
    this.log(`Writing ${value} to ${address}`);
    this.buf.writeUInt32LE({ value: value >>> 0, offset: address * 4 });
  }

  watch(from: number, to: number, renderAs: "byte" | "word" | "dword") {
    return this.buf.watch(from * 4, to * 4, this.cogId, renderAs);
  }
}
