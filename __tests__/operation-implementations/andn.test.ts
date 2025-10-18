import { describe } from "vitest";
import { ANDNOperation } from "../../src/operations/implementations/andn.js";
import { testTruthTable } from "./test-truth-table.js";

describe("ANDN", () => {
  testTruthTable(ANDNOperation)`
    dest            | src    | result  | z    | c
    ${0xf731_125a}  | ${-6}   | ${0}    | ${1} | ${0}
    ${0xf731_125a}  | ${-8}   | ${2}    | ${0} | ${1}
    ${0xf731_125a}  | ${-16}  | ${10}   | ${0} | ${0}
  `;
});
