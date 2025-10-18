import { describe, expect, it } from "vitest";
import { encodeOpcode } from "../../src/opcodes/encodeOpcode.js";
import { MOVSOperation } from "../../src/operations/implementations/movs.js";
import { getTestCog } from "./getTestCog.js";
import { runOperation } from "./runOperation.js";
import { testTruthTable } from "./test-truth-table.js";

describe("MOVS", () => {
  it("should update the src field in a register with an immediate value", async () => {
    const cog = getTestCog();

    cog.writeRegister(0x50, 0xdeadbeef); // Initial value

    const MOVS = new MOVSOperation(
      encodeOpcode({
        instr: "MOVS",
        zcri: 0b1111,
        con: "ALWAYS",
        dest: 0x50,
        src: 0x00,
      }),
      cog
    );
    await runOperation(MOVS);

    expect(cog.readRegister(0x50) >>> 0).toBe(0xdeadbe00);
    expect(cog.Z).toBe(true);
    expect(cog.C).toBe(false);
  });

  it("should update the src field in a register with a register value", async () => {
    const cog = getTestCog();

    cog.writeRegister(0x50, 0xdeadbeef); // Initial value
    cog.writeRegister(0x30, 0b101010101); // New SRC

    const MOVS = new MOVSOperation(
      encodeOpcode({
        instr: "MOVS",
        zcri: 0b1110,
        con: "ALWAYS",
        dest: 0x50,
        src: 0x30,
      }),
      cog
    );
    await runOperation(MOVS);

    expect(cog.readRegister(0x50)).toBe(0xdeadbf55);
    expect(cog.Z).toBe(false);
    expect(cog.C).toBe(true);
  });

  it("should truncate the value", async () => {
    const cog = getTestCog();

    cog.writeRegister(0x50, 0xdeadbeef); // Initial value
    cog.writeRegister(0x30, 0b1010101010101); // New DEST

    const MOVS = new MOVSOperation(
      encodeOpcode({
        instr: "MOVS",
        zcri: 0b1110,
        con: "ALWAYS",
        dest: 0x50,
        src: 0x30,
      }),
      cog
    );
    await runOperation(MOVS);

    expect(cog.readRegister(0x50) >>> 0).toBe(0xdeadbf55);
    expect(cog.Z).toBe(false);
    expect(cog.C).toBe(true);
  });

  it("should set the z flag on a zero value", async () => {
    const cog = getTestCog();

    cog.writeRegister(0x50, 0xdeadbeef); // Initial value
    cog.writeRegister(0x30, 0b1010101010101); // New SRC

    const MOVS = new MOVSOperation(
      encodeOpcode({
        instr: "MOVS",
        zcri: 0b1110,
        con: "ALWAYS",
        dest: 0x50,
        src: 0x30,
      }),
      cog
    );
    await runOperation(MOVS);

    expect(cog.readRegister(0x50) >>> 0).toBe(0xdeadbf55);
    expect(cog.Z).toBe(false);
    expect(cog.C).toBe(true);
  });

  testTruthTable(MOVSOperation)`
    dest  | src    | result  | z    | c
    ${0}  | ${0}   | ${0}    | ${1} | ${0}
    ${0}  | ${511} | ${511}  | ${0} | ${1}
    ${-1} | ${511} | ${-1}   | ${0} | ${0}
    ${-1} | ${0}   | ${-512} | ${1} | ${0}`;
});
