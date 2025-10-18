import { describe } from "vitest";
import { XOROperation } from "../../src/operations/implementations/xor.js";
import { testTruthTable } from "./test-truth-table.js";

describe("XOR", () => {
  testTruthTable(XOROperation)`
    dest   | src    | result | z    | c
    ${10}  | ${5}   | ${15}  | ${0} | ${0}
    ${10}  | ${7}   | ${13}  | ${0} | ${1}
    ${10}  | ${10}  | ${0}   | ${1} | ${0}
    ${10}  | ${13}  | ${7}   | ${0} | ${1}
    ${10}  | ${15}  | ${5}   | ${0} | ${0}
  `;
});
