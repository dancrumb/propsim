import { describe } from "vitest";
import { CMPOperation } from "../../src/operations/implementations/cmp.js";
import { testTruthTable } from "./test-truth-table.js";

describe("CMP", () => {
  testTruthTable(CMPOperation)`
        dest  | src    | result  | z    | c
        ${3}  | ${2}   | ${1}    | ${0} | ${0}
        ${3}  | ${3}   | ${0}    | ${1} | ${0}
        ${3}  | ${4}   | ${-1}   | ${0} | ${1}
        ${0x8000_0000}  | ${0x7fff_ffff}   | ${1}    | ${0} | ${0}
        ${0x7fff_ffff}  | ${0x8000_0000}   | ${-1}   | ${0} | ${1}
        ${0xffff_fffe}  | ${0xffff_ffff}   | ${-1}   | ${0} | ${1}
        ${0xffff_fffe}  | ${0xffff_fffe}   | ${0}    | ${1} | ${0}
        ${0xffff_fffe}  | ${0xffff_fffd}   | ${1}    | ${0} | ${0}
`;
});
