import { describe } from "vitest";
import { SHLOperation } from "../../src/operations/implementations/shl.js";
import { testTruthTable } from "./test-truth-table.js";

describe("SHL", () => {
  testTruthTable(SHLOperation)`
    dest            | src    | result         | z    | c
    ${0x8765_4321}  | ${4}   | ${0x7654_3210} | ${0} | ${1}
    ${0x7654_3210}  | ${12}  | ${0x4321_0000} | ${0} | ${0}
    ${0x4321_0000}  | ${16}  | ${0x0000_0000} | ${1} | ${0}
  `;
});
