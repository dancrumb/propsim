import { describe, expect, it } from "vitest";
import { encodeOpcode } from "../../src/opcodes/encodeOpcode.js";
import { ADDSOperation } from "../../src/operations/implementations/adds.js";
import { getTestCog } from "./getTestCog.js";
import { runOperation } from "./runOperation.js";
import { testTruthTable } from "./test-truth-table.js";

describe("ADDS", () => {
  it("should correctly compute the sum and set flags for a positive result", async () => {
    const cog = getTestCog();

    cog.writeRegister(0x50, 10); // Source address with a negative value
    cog.writeRegister(0x30, 11); // Destination address

    const adds = new ADDSOperation(
      encodeOpcode({
        instr: "ADDS",
        zcri: 0b1110,
        con: "ALWAYS",
        dest: 0x30,
        src: 0x50,
      }),
      cog
    );
    await runOperation(adds);

    expect(cog.readRegister(0x30)).toBe(21);
    expect(cog.Z).toBe(false);
    expect(cog.C).toBe(false);
  });
  it("should correctly compute the sum and set flags for a zero result", async () => {
    const cog = getTestCog();

    cog.writeRegister(0x50, -11); // Source address with a negative value
    cog.writeRegister(0x30, 11); // Destination address

    const adds = new ADDSOperation(
      encodeOpcode({
        instr: "ADDS",
        zcri: 0b1110,
        con: "ALWAYS",
        dest: 0x30,
        src: 0x50,
      }),
      cog
    );
    await runOperation(adds);

    expect(cog.readRegister(0x30)).toBe(0);
    expect(cog.Z).toBe(true);
    expect(cog.C).toBe(false);
  });
  it("should correctly compute the sum and set flags for an overflow", async () => {
    const cog = getTestCog();

    cog.writeRegister(0x50, 0xffffff00); // Source address with a negative value
    cog.writeRegister(0x30, 0x105); // Destination address

    const adds = new ADDSOperation(
      encodeOpcode({
        instr: "ADDS",
        zcri: 0b1110,
        con: "ALWAYS",
        dest: 0x30,
        src: 0x50,
      }),
      cog
    );
    await runOperation(adds);

    expect(cog.readRegister(0x30)).toBe(5);
    expect(cog.Z).toBe(false);
    expect(cog.C).toBe(false);
  });
  it("should correctly compute the absolute value and set flags for an immediate value", async () => {
    const cog = getTestCog();

    cog.writeRegister(0x30, 11); // Destination address

    const adds = new ADDSOperation(
      encodeOpcode({
        instr: "ADDS",
        zcri: 0b1111,
        con: "ALWAYS",
        dest: 0x30,
        src: 0x50,
      }),
      cog
    );
    await runOperation(adds);

    expect(cog.readRegister(0x30)).toBe(0x50 + 11);
    expect(cog.Z).toBe(false);
    expect(cog.C).toBe(false);
  });

  testTruthTable(ADDSOperation)`
      dest            | src    | result         | z    | c
      ${0xffff_ffff}  | ${1}   | ${0}           | ${1} | ${0}
      ${0xffff_ffff}  | ${2}   | ${1}           | ${0} | ${0}
      ${1}            | ${-1}  | ${0}           | ${1} | ${0}
      ${1}            | ${-2}  | ${0xffff_ffff} | ${0} | ${0}
      ${0x7fff_fffe}  | ${1}   | ${0x7fff_ffff} | ${0} | ${0}
      ${0x7fff_fffe}  | ${2}   | ${0x8000_0000} | ${0} | ${1}
      ${0x8000_0001}  | ${-1}  | ${0x8000_0000} | ${0} | ${0}
      ${0x8000_0001}  | ${-2}  | ${0x7fff_ffff} | ${0} | ${1}
      `;
});
