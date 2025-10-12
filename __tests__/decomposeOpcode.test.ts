import { describe, it, expect } from "vitest";
import { decomposeOpcode } from "../src/decomposeOpcode.js";

describe("decomposeOpcode", () => {
  it("decomposes opcodes into their constituent parts", () => {
    const decomposed = decomposeOpcode(0b10101001011111010101010101010101);
    expect(decomposed?.instr).toEqual("ABS");
    expect(decomposed?.zcri).toEqual(0b0101);
    expect(decomposed?.con).toEqual("ALWAYS");
    expect(decomposed?.dest).toEqual(0b010101010);
    expect(decomposed?.src).toEqual(0b101010101);
  });
});
