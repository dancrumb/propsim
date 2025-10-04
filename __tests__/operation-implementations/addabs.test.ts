import { describe, it, expect } from "vitest";
import { CogRam } from "../../src/CogRam.js";
import { CogFlags } from "../../src/CogFlags.js";
import { ADDABS } from "../../src/operation-implementations/addabs.js";

describe("ADDABS", () => {
  it("should correctly compute the sum and set flags for a positive result", async () => {
    const cogRam = new CogRam();
    const cogFlags = new CogFlags();

    cogRam.writeRegister(0x50, 10); // Source address with a negative value
    cogRam.writeRegister(0x30, 11); // Destination address

    await ADDABS(
      {
        instr: "ADDABS",
        zcri: 0b1110,
        con: 0b1111,
        dest: 0x30,
        src: 0x50,
      },
      cogRam,
      cogFlags
    );

    expect(cogRam.readRegister(0x30)).toBe(21);
    expect(cogFlags._Z).toBe(false);
    expect(cogFlags.C).toBe(false);
  });
  it("should correctly compute the sum and set flags for a zero result", async () => {
    const cogRam = new CogRam();
    const cogFlags = new CogFlags();

    cogRam.writeRegister(0x50, -11); // Source address with a negative value
    cogRam.writeRegister(0x30, 11); // Destination address

    await ADDABS(
      {
        instr: "ADDABS",
        zcri: 0b1110,
        con: 0b1111,
        dest: 0x30,
        src: 0x50,
      },
      cogRam,
      cogFlags
    );

    expect(cogRam.readRegister(0x30)).toBe(22);
    expect(cogFlags._Z).toBe(false);
    expect(cogFlags.C).toBe(false);
  });
  it("should correctly compute the sum and set flags for an overflow", async () => {
    const cogRam = new CogRam();
    const cogFlags = new CogFlags();

    cogRam.writeURegister(0x50, 0xffffff00); // Source address with a negative value
    cogRam.writeURegister(0x30, 0x105); // Destination address

    await ADDABS(
      {
        instr: "ADDABS",
        zcri: 0b1110,
        con: 0b1111,
        dest: 0x30,
        src: 0x50,
      },
      cogRam,
      cogFlags
    );

    expect(cogRam.readRegister(0x30)).toBe(517);
    expect(cogFlags._Z).toBe(false);
    expect(cogFlags.C).toBe(false);
  });
  it("should correctly compute the absolute value and set flags for an immediate value", async () => {
    const cogRam = new CogRam();
    const cogFlags = new CogFlags();

    cogRam.writeRegister(0x30, 11); // Destination address

    await ADDABS(
      {
        instr: "ADDABS",
        zcri: 0b1111,
        con: 0b1111,
        dest: 0x30,
        src: 0x50,
      },
      cogRam,
      cogFlags
    );

    expect(cogRam.readRegister(0x30)).toBe(0x50 + 11);
    expect(cogFlags._Z).toBe(false);
    expect(cogFlags.C).toBe(false);
  });
});
