import { describe, expect, it } from "vitest";
import { get_parity } from "../../src/operations/utils/get_parity.js";
describe("get_parity", () => {
  it("should return true for numbers with odd parity", () => {
    expect(get_parity(0b00000001)).toBe(true); // 1 one bit
    expect(get_parity(0b00000011)).toBe(false); // 2 one bits
    expect(get_parity(0b00000111)).toBe(true); // 3 one bits
    expect(get_parity(0b11111111)).toBe(false); // 8 one bits
    expect(get_parity(0b10101010)).toBe(false); // 4 one bits
    expect(get_parity(0b11110000)).toBe(false); // 4 one bits
    expect(get_parity(0b11111110)).toBe(true); // 7 one bits
  });
});
