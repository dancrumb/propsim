import { describe } from "vitest";
import { MOVOperation } from "../../src/operations/implementations/mov.js";
import { testTruthTable } from "./test-truth-table.js";

describe("MOV", () => {
  testTruthTable(MOVOperation)`
    dest  | src   | result  | z    | c
    ${0}  | ${-1} | ${-1}   | ${0} | ${1}
    ${0}  | ${0}  | ${0}    | ${1} | ${0}
    ${0}  | ${1}  | ${1}    | ${0} | ${0}
  `;
});
