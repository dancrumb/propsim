import { describe } from "vitest";
import { ROLOperation } from "../../src/operations/implementations/rol.js";
import { testTruthTable } from "./test-truth-table.js";

describe("ROL", () => {
  testTruthTable(ROLOperation)`
    dest            | src    | result         | z    | c
    ${0}            | ${0}   | ${0}           | ${1} | ${0}
    ${0x8765_4321}  | ${4}   | ${0x7654_3218} | ${0} | ${1}
    ${0x7654_3218}  | ${12}  | ${0x4321_8765} | ${0} | ${0}
    ${0x4321_8765}  | ${16}  | ${0x8765_4321} | ${0} | ${0}
  `;
});
