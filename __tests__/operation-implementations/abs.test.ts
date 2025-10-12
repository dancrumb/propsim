import { describe, it, expect } from "vitest";
import { ABSOperation } from "../../src/operation-implementations/abs.js";
import { Cog } from "../../src/chip/Cog.js";
import { SystemClock } from "../../src/chip/SystemClock.js";
import { Hub } from "../../src/chip/Hub.js";
import { SystemCounter } from "../../src/chip/SystemCounter.js";
import { MainRam } from "../../src/chip/MainRam.js";
import { BehaviorSubject } from "rxjs";
import { encodeOpcode } from "../../src/encodeOpcode.js";
import { Operation } from "../../src/Operation.js";

const getTestCog = () => {
  const clock = new SystemClock();
  const counter = new SystemCounter(clock);
  const hub = new Hub(
    clock,
    1,
    new MainRam("NUL"),
    new BehaviorSubject([true] as boolean[])
  );
  const cog = new Cog(clock, hub, counter, 0);

  return cog;
};

const runOperation = async (operation: Operation) => {
  operation.fetchDstOperand();
  operation.fetchSrcOperand();
  await operation.performOperation();
  operation.storeResult();
};

describe("ABS", () => {
  it("should correctly compute the absolute value and set flags for a negative number", async () => {
    const cog = getTestCog();

    cog.writeRegister(0x50, -12345); // Source address with a negative value

    const abs = new ABSOperation(
      encodeOpcode({
        instr: "ABS",
        zcri: 0b1110,
        con: "ALWAYS",
        dest: 0x30,
        src: 0x50,
      }),
      cog
    );
    await runOperation(abs);

    expect(cog.readRegister(0x30)).toBe(12345);
    expect(cog.Z).toBe(false);
    expect(cog.C).toBe(true);
  });
  it("should correctly compute the absolute value and set flags for a positive number", async () => {
    const cog = getTestCog();

    cog.writeRegister(0x50, 12345); // Source address with a negative value

    const abs = new ABSOperation(
      encodeOpcode({
        instr: "ABS",
        zcri: 0b1110,
        con: "ALWAYS",
        dest: 0x30,
        src: 0x50,
      }),
      cog
    );
    await runOperation(abs);

    expect(cog.readRegister(0x30)).toBe(12345);
    expect(cog.Z).toBe(false);
    expect(cog.C).toBe(false);
  });

  it("should correctly compute the absolute value and set flags for zero", async () => {
    const cog = getTestCog();

    cog.writeRegister(0x50, 0);

    const abs = new ABSOperation(
      encodeOpcode({
        instr: "ABS",
        zcri: 0b1110,
        con: "ALWAYS",
        dest: 0x30,
        src: 0x50,
      }),
      cog
    );
    await runOperation(abs);

    expect(cog.readRegister(0x30)).toBe(0);
    expect(cog.Z).toBe(true);
    expect(cog.C).toBe(false);
  });
  it("should correctly compute the absolute value and set flags for an immediate value", async () => {
    const cog = getTestCog();

    cog.writeRegister(0x50, 0);

    const abs = new ABSOperation(
      encodeOpcode({
        instr: "ABS",
        zcri: 0b1111,
        con: "ALWAYS",
        dest: 0x30,
        src: 0x50,
      }),
      cog
    );
    await runOperation(abs);

    expect(cog.readRegister(0x30)).toBe(0x50);
    expect(cog.Z).toBe(false);
    expect(cog.C).toBe(false);
  });
});
