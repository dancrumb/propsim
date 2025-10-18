import { describe, expect, it } from "vitest";
import { encodeOpcode } from "../../src/opcodes/encodeOpcode.js";
import { MOVDOperation } from "../../src/operations/implementations/movd.js";
import { getTestCog } from "./getTestCog.js";
import { runOperation } from "./runOperation.js";
import { testTruthTable } from "./test-truth-table.js";

describe("MOVD", () => {
  it("should update the dest field in a register with an immediate value", async () => {
    const cog = getTestCog();

    cog.writeRegister(0x50, 0xdeadbeef); // Initial value

    const MOVD = new MOVDOperation(
      encodeOpcode({
        instr: "MOVD",
        zcri: 0b1111,
        con: "ALWAYS",
        dest: 0x50,
        src: 0x00,
      }),
      cog
    );
    await runOperation(MOVD);

    expect(cog.readRegister(0x50) >>> 0).toBe(0xdeac00ef);
    expect(cog.Z).toBe(true);
    expect(cog.C).toBe(false);
  });

  it("should update the dest field in a register with a register value", async () => {
    const cog = getTestCog();

    cog.writeRegister(0x50, 0xdeadbeef); // Initial value
    cog.writeRegister(0x30, 0b101010101); // New DEST

    const MOVD = new MOVDOperation(
      encodeOpcode({
        instr: "MOVD",
        zcri: 0b1110,
        con: "ALWAYS",
        dest: 0x50,
        src: 0x30,
      }),
      cog
    );
    await runOperation(MOVD);

    expect(cog.readRegister(0x50) >>> 0).toBe(0xdeaeaaef);
    expect(cog.Z).toBe(false);
    expect(cog.C).toBe(true);
  });

  it("should truncate the value", async () => {
    const cog = getTestCog();

    cog.writeRegister(0x50, 0xdeadbeef); // Initial value
    cog.writeRegister(0x30, 0b1010101010101); // New DEST

    const MOVD = new MOVDOperation(
      encodeOpcode({
        instr: "MOVD",
        zcri: 0b1110,
        con: "ALWAYS",
        dest: 0x50,
        src: 0x30,
      }),
      cog
    );
    await runOperation(MOVD);

    expect(cog.readRegister(0x50) >>> 0).toBe(0xdeaeaaef);
    expect(cog.Z).toBe(false);
    expect(cog.C).toBe(true);
  });

  it("should set the z flag on a zero value", async () => {
    const cog = getTestCog();

    cog.writeRegister(0x50, 0xdeadbeef); // Initial value
    cog.writeRegister(0x30, 0b1010101010101); // New DEST

    const MOVD = new MOVDOperation(
      encodeOpcode({
        instr: "MOVD",
        zcri: 0b1110,
        con: "ALWAYS",
        dest: 0x50,
        src: 0x30,
      }),
      cog
    );
    await runOperation(MOVD);

    expect(cog.readRegister(0x50) >>> 0).toBe(0xdeaeaaef);
    expect(cog.Z).toBe(false);
    expect(cog.C).toBe(true);
  });

  testTruthTable(MOVDOperation)`
    dest  | src    | result     | z    | c
    ${0}  | ${0}   | ${0}       | ${1} | ${0}
    ${0}  | ${511} | ${261632}  | ${0} | ${1}
    ${-1} | ${511} | ${-1}      | ${0} | ${0}
    ${-1} | ${0}   | ${-261633} | ${1} | ${0}
  `;
});
