import { describe, expect, it } from "vitest";
import { rol } from "../../src/operations/utils/rol";

describe("rol", () => {
  it("rotates bits left", () => {
    expect(rol(0, 1)).toBe(0);
    expect(rol(0b01, 1)).toBe(0b10);
    expect(rol(1, 4)).toBe(0b10000);
    expect(rol(0x8000_0000, 1)).toBe(1);
    expect(rol(0x8000_0000, 4)).toBe(0b1000);
  });
});
