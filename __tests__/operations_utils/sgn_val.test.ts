import { describe, expect, it } from "vitest";
import { sgn_val } from "../../src/operations/utils/sgn_val.js";

describe("sgn_val", () => {
  it("should return a signed values from a hex representation", () => {
    expect(sgn_val(0)).toBe(0);
    expect(sgn_val(1)).toBe(1);
    expect(sgn_val(-1)).toBe(-1);
    expect(sgn_val(0x7fffffff)).toBe(2147483647);
    expect(sgn_val(0x80000001)).toBe(-2147483647);
    expect(sgn_val(0x80000000)).toBe(-2147483648);

    expect(sgn_val(-2147483648)).toBe(-2147483648);
    expect(sgn_val(0xffffffff)).toBe(-1);
  });
});
