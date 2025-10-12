import { describe, expect, it } from "vitest";
import { encodeOpcode } from "../../src/opcodes/encodeOpcode";

describe("encodeOpcode", () => {
  it("should encode the opcode correctly", () => {
    const opcode = encodeOpcode({
      instr: "ABS",
      zcri: 0b0101,
      con: "ALWAYS",
      dest: 0b010101010,
      src: 0b101010101,
    });

    expect(opcode).toEqual(0b1010_1001_0111_1101_0101_0101_0101_0101);
  });
});
