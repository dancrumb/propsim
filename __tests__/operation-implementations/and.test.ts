import { describe } from "vitest";
import { ANDOperation } from "../../src/operations/implementations/and.js";
import { testTruthTable } from "./test-truth-table.js";

describe("AND", () => {
  testTruthTable(ANDOperation)`
    dest   | src    | result  | z    | c
    ${10}  | ${5}   | ${0}    | ${1} | ${0}
    ${10}  | ${7}   | ${2}    | ${0} | ${1}
    ${10}  | ${15}  | ${10}   | ${0} | ${0}
  `;
});
