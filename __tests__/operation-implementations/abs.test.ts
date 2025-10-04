import { describe, it, expect } from "vitest";
import { CogRam } from "../../src/CogRam.js";
import { CogFlags } from "../../src/chip/CogFlags.js";
import { ABS } from "../../src/operation-implementations/abs.js";

describe("ABS", () => {
  it("should correctly compute the absolute value and set flags for a negative number", async () => {
    const cogRam = new CogRam();
    const cogFlags = new CogFlags();

    cogRam.writeRegister(0x50, -12345); // Source address with a negative value

    await ABS(
      {
        instr: "ABS",
        zcri: 0b1110,
        con: 0b1111,
        dest: 0x30,
        src: 0x50,
      },
      cogRam,
      cogFlags
    );

    expect(cogRam.readRegister(0x30)).toBe(12345);
    expect(cogFlags._Z).toBe(false);
    expect(cogFlags.C).toBe(true);
  });
  it("should correctly compute the absolute value and set flags for a positive number", async () => {
    const cogRam = new CogRam();
    const cogFlags = new CogFlags();

    cogRam.writeRegister(0x50, 12345); // Source address with a negative value

    await ABS(
      {
        instr: "ABS",
        zcri: 0b1110,
        con: 0b1111,
        dest: 0x30,
        src: 0x50,
      },
      cogRam,
      cogFlags
    );

    expect(cogRam.readRegister(0x30)).toBe(12345);
    expect(cogFlags._Z).toBe(false);
    expect(cogFlags.C).toBe(false);
  });
  it("should correctly compute the absolute value and set flags for zero", async () => {
    const cogRam = new CogRam();
    const cogFlags = new CogFlags();

    cogRam.writeRegister(0x50, 0); // Source address with a negative value

    await ABS(
      {
        instr: "ABS",
        zcri: 0b1110,
        con: 0b1111,
        dest: 0x30,
        src: 0x50,
      },
      cogRam,
      cogFlags
    );

    expect(cogRam.readRegister(0x30)).toBe(0);
    expect(cogFlags._Z).toBe(true);
    expect(cogFlags.C).toBe(false);
  });
  it("should correctly compute the absolute value and set flags for an immediate value", async () => {
    const cogRam = new CogRam();
    const cogFlags = new CogFlags();

    cogRam.writeRegister(0x50, 0); // Source address with a negative value

    await ABS(
      {
        instr: "ABS",
        zcri: 0b1111,
        con: 0b1111,
        dest: 0x30,
        src: 0x50,
      },
      cogRam,
      cogFlags
    );

    expect(cogRam.readRegister(0x30)).toBe(0x50);
    expect(cogFlags._Z).toBe(false);
    expect(cogFlags.C).toBe(false);
  });
});
