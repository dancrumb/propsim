import { describe } from "vitest";
import { SHROperation } from "../../src/operations/implementations/shr.js";
import { testTruthTable } from "./test-truth-table.js";

describe("SHR", () => {
  testTruthTable(SHROperation)`
    dest            | src    | result         | z    | c
    ${0x1234_5678}  | ${4}   | ${0x0123_4567} | ${0} | ${0}
    ${0x0123_4567}  | ${12}  | ${0x0000_1234} | ${0} | ${1}
    ${0x0000_1234}  | ${16}  | ${0x0000_0000} | ${1} | ${0}
  `;
});
