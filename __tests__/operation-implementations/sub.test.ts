import { describe } from "vitest";
import { SUBOperation } from "../../src/operations/implementations/sub.js";
import { testTruthTable } from "./test-truth-table.js";

describe("SUB", () => {
  testTruthTable(SUBOperation)`
        dest  | src    | result         | z    | c
        ${2}  | ${1}   | ${1}           | ${0} | ${0}
        ${2}  | ${2}   | ${0}           | ${1} | ${0}
        ${2}  | ${3}   | ${0xffff_ffff} | ${0} | ${1}
`;
});
