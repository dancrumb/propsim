import { describe, expect, it } from "vitest";
import { decodeOpcode } from "../../src/opcodes/decodeOpcode.js";

describe("decodeOpcode", () => {
  it("decodes opcodes into their constituent parts", () => {
    const decoded = decodeOpcode(0b10101001011111010101010101010101);
    expect(decoded?.instr).toEqual("ABS");
    expect(decoded?.zcri).toEqual(0b0101);
    expect(decoded?.con).toEqual("ALWAYS");
    expect(decoded?.dest).toEqual(0b010101010);
    expect(decoded?.src).toEqual(0b101010101);
  });
});
