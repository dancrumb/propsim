import { describe, expect, it } from "vitest";
import { abs_val } from "../../src/operations/utils/abs_val.js";

describe("abs_val", () => {
  it("should return a signed values from a hex representation", () => {
    expect(abs_val(0)).toBe(0);
    expect(abs_val(1)).toBe(1);
    expect(abs_val(-1)).toBe(1);
    expect(abs_val(0x7fffffff)).toBe(2147483647);
    expect(abs_val(0x80000001)).toBe(2147483647);
    expect(abs_val(0xffffffff)).toBe(1);
  });
});
