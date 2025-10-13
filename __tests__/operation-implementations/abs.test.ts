import { describe, expect, it } from "vitest";
import { encodeOpcode } from "../../src/opcodes/encodeOpcode.js";
import { ABSOperation } from "../../src/operations/implementations/abs.js";
import { getTestCog } from "./getTestCog.js";
import { runOperation } from "./runOperation.js";

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
