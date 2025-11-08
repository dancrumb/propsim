import { readFileSync } from "node:fs";
import { ObservableBuffer, WatchLocation } from "../ObservableBuffer.js";

export class MainRam {
  private buf: ObservableBuffer = new ObservableBuffer(32 * 8196);
  constructor(private filename: string) {
    if (filename === "NUL") {
      return;
    }
    const fileBuf = readFileSync(this.filename, null);
    if (fileBuf.length > this.buf.length) {
      throw new Error("File too large for MainRam");
    }
    this.buf.loadFromBuffer(fileBuf);
  }

  get size() {
    return this.buf.length;
  }

  writeByte({ address, value }: { address: number; value: number }) {
    this.buf.writeUInt8({ value: value & 0xff, offset: address });
  }

  writeWord({ address, value }: { address: number; value: number }) {
    this.buf.writeUInt16LE({
      value: value & 0xffff,
      offset: address & 0xfffffe,
    });
  }

  writeLong({ address, value }: { address: number; value: number }) {
    this.buf.writeInt32LE({ value, offset: address & 0xfffffc });
  }

  readByte(address: number): number {
    return this.buf.readUInt8(address);
  }

  readWord(address: number): number {
    return this.buf.readUInt16LE(address & 0xfffffe);
  }

  readLong(address: number): number {
    return this.buf.readUInt32LE(address & 0xfffffc);
  }

  watch(from: number, to: number, renderAs: "byte" | "word" | "dword") {
    return this.buf.watch(from, to, WatchLocation.Main, renderAs);
  }
}
