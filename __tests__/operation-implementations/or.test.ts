import { describe } from "vitest";
import { OROperation } from "../../src/operations/implementations/or.js";
import { testTruthTable } from "./test-truth-table.js";

describe("OR", () => {
  testTruthTable(OROperation)`
    dest  | src   | result  | z    | c
    ${0}  | ${0}  | ${0}    | ${1} | ${0}
    ${0}  | ${1}  | ${1}    | ${0} | ${1}
    ${10} | ${5}  | ${15}   | ${0} | ${0}
  `;
});
