import { describe, expect, it } from "vitest";
import { ObservableBuffer, WatchLocation } from "../src/ObservableBuffer.js";
import { expectEmitsInOrder } from "./rxjs-testing.js";

describe("ObservableBuffer", () => {
  it("should create an observable buffer", () => {
    const buffer = new ObservableBuffer(1024);
    expect(buffer.length).toBe(1024);
  });

  it("should throw an error if put value is too large", () => {
    const buffer = new ObservableBuffer(1024);
    expect(() => buffer.put(0, 0xff)).not.toThrow();
    expect(() => buffer.put(0, 0x0100)).toThrowError(
      "Value 256 exceeds byte size. Only values between 0x00 and 0xff are allowed."
    );
  });

  it("should throw an error if the watch range exceeds the buffer length", () => {
    const buffer = new ObservableBuffer(1024);
    expect(() => buffer.watch(0, 1025, WatchLocation.Main, "byte")).toThrow(
      "Watch range exceeds buffer length."
    );
  });

  it("should notify observers on uint8 write (byte)", async () => {
    const buffer = new ObservableBuffer(1024);
    const subscription$ = buffer.watch(0, 3, WatchLocation.Main, "byte");
    const outcome = expectEmitsInOrder(subscription$, [
      { location: WatchLocation.Main, data: [0, 0, 0, 0] },
      { location: WatchLocation.Main, data: [1, 0, 0, 0] },
      { location: WatchLocation.Main, data: [1, 2, 0, 0] },
      { location: WatchLocation.Main, data: [1, 2, 3, 0] },
      { location: WatchLocation.Main, data: [1, 2, 3, 4] },
    ]);

    buffer.writeUInt8(1, 0);
    buffer.writeUInt8(2, 1);
    buffer.writeUInt8(3, 2);
    buffer.writeUInt8(4, 3);

    await outcome;
  });

  it("should notify observers on uint8 write (word)", async () => {
    const buffer = new ObservableBuffer(1024);
    const subscription$ = buffer.watch(0, 3, WatchLocation.Main, "word");
    const outcome = expectEmitsInOrder(subscription$, [
      { location: WatchLocation.Main, data: [0, 0] },
      { location: WatchLocation.Main, data: [1, 0] },
      { location: WatchLocation.Main, data: [0x0201, 0] },
      { location: WatchLocation.Main, data: [0x0201, 0x03] },
      { location: WatchLocation.Main, data: [0x0201, 0x0403] },
    ]);

    buffer.writeUInt8(1, 0);
    buffer.writeUInt8(2, 1);
    buffer.writeUInt8(3, 2);
    buffer.writeUInt8(4, 3);

    await outcome;
  });

  it("should notify observers on uint8 write (dword)", async () => {
    const buffer = new ObservableBuffer(1024);
    const subscription$ = buffer.watch(0, 3, WatchLocation.Main, "dword");
    const outcome = expectEmitsInOrder(subscription$, [
      { location: WatchLocation.Main, data: [0] },
      { location: WatchLocation.Main, data: [1] },
      { location: WatchLocation.Main, data: [0x0201] },
      { location: WatchLocation.Main, data: [0x030201] },
      { location: WatchLocation.Main, data: [0x04030201] },
    ]);

    buffer.writeUInt8(1, 0);
    buffer.writeUInt8(2, 1);
    buffer.writeUInt8(3, 2);
    buffer.writeUInt8(4, 3);

    await outcome;
  });

  it("should notify observers on uint16 write (byte)", async () => {
    const buffer = new ObservableBuffer(1024);
    const subscription$ = buffer.watch(0, 3, WatchLocation.Main, "byte");
    const outcome = expectEmitsInOrder(subscription$, [
      { location: WatchLocation.Main, data: [0, 0, 0, 0] },
      { location: WatchLocation.Main, data: [1, 2, 0, 0] },
      { location: WatchLocation.Main, data: [1, 2, 3, 4] },
    ]);

    buffer.writeUInt16LE(0x0201, 0);
    buffer.writeUInt16LE(0x0403, 2);
    await outcome;
  });

  it("should notify observers on uint16 write (word)", async () => {
    const buffer = new ObservableBuffer(1024);
    const subscription$ = buffer.watch(0, 3, WatchLocation.Main, "word");
    const outcome = expectEmitsInOrder(subscription$, [
      { location: WatchLocation.Main, data: [0, 0] },
      { location: WatchLocation.Main, data: [0x0201, 0] },
      { location: WatchLocation.Main, data: [0x0201, 0x0403] },
    ]);

    buffer.writeUInt16LE(0x0201, 0);
    buffer.writeUInt16LE(0x0403, 2);

    await outcome;
  });

  it("should notify observers on uint16 write (dword)", async () => {
    const buffer = new ObservableBuffer(1024);
    const subscription$ = buffer.watch(0, 3, WatchLocation.Main, "dword");
    const outcome = expectEmitsInOrder(subscription$, [
      { location: WatchLocation.Main, data: [0] },
      { location: WatchLocation.Main, data: [0x00000201] },
      { location: WatchLocation.Main, data: [0x04030201] },
    ]);

    buffer.writeUInt16LE(0x0201, 0);
    buffer.writeUInt16LE(0x0403, 2);

    await outcome;
  });

  it("should notify observers on uint32 write (byte)", async () => {
    const buffer = new ObservableBuffer(1024);
    const subscription$ = buffer.watch(0, 3, WatchLocation.Main, "byte");
    const outcome = expectEmitsInOrder(subscription$, [
      { location: WatchLocation.Main, data: [0, 0, 0, 0] },
      { location: WatchLocation.Main, data: [1, 2, 3, 4] },
    ]);
    buffer.writeUInt32LE(0x04030201, 0);

    await outcome;
  });

  it("should notify observers on uint32 write (word)", async () => {
    const buffer = new ObservableBuffer(1024);
    const subscription$ = buffer.watch(0, 3, WatchLocation.Main, "word");
    const outcome = expectEmitsInOrder(subscription$, [
      { location: WatchLocation.Main, data: [0, 0] },
      { location: WatchLocation.Main, data: [0x0201, 0x0403] },
    ]);

    buffer.writeUInt32LE(0x04030201, 0);

    await outcome;
  });

  it("should notify observers on uint32 write (dword)", async () => {
    const buffer = new ObservableBuffer(1024);
    const subscription$ = buffer.watch(0, 3, WatchLocation.Main, "dword");
    const outcome = expectEmitsInOrder(subscription$, [
      { location: WatchLocation.Main, data: [0] },
      { location: WatchLocation.Main, data: [0x04030201] },
    ]);

    buffer.writeUInt32LE(0x04030201, 0);

    await outcome;
  });
});
