import { describe } from "vitest";
import { ADDXOperation } from "../../src/operations/implementations/addx.js";
import { testXTruthTable } from "./test-x-truth-table.js";

describe("ADDX", () => {
  testXTruthTable(ADDXOperation)`
        dest           | src   |  z    | c     | result         | res_z | res_c
        ${0xffff_fffe} | ${1}  | ${0}  | ${0}  | ${0xffff_ffff} | ${0}  | ${0}
        ${0xffff_fffe} | ${1}  | ${0}  | ${1}  | ${0}           | ${0}  | ${1}
        ${0xffff_fffe} | ${1}  | ${1}  | ${1}  | ${0}           | ${1}  | ${1}
        `;
});
