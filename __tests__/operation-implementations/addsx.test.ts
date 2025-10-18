import { describe } from "vitest";
import { ADDSXOperation } from "../../src/operations/implementations/addsx.js";
import { testXTruthTable } from "./test-x-truth-table.js";

describe("ADDSX", () => {
  testXTruthTable(ADDSXOperation)`
        dest    | src   |  z    | c     | result         | res_z | res_c
        ${-2}   | ${1}  | ${0}  | ${0}  | ${-1}          | ${0}  | ${0}
        ${-2}   | ${1}  | ${0}  | ${1}  | ${0}           | ${0}  | ${0}
        ${-2}   | ${1}  | ${1}  | ${1}  | ${0}           | ${1}  | ${0}
        ${1}    | ${-2} | ${0}  | ${0}  | ${-1}          | ${0}  | ${0}
        ${1}    | ${-2} | ${0}  | ${1}  | ${0}           | ${0}  | ${0}
        ${1}    | ${-2} | ${1}  | ${1}  | ${0}           | ${1}  | ${0}
        ${0x7fff_fffe} | ${1}  | ${0}  | ${0}  | ${0x7fff_ffff} | ${0}  | ${0}
        ${0x7fff_fffe} | ${1}  | ${0}  | ${1}  | ${0x8000_0000} | ${0}  | ${1}
        ${0x7fff_fffe} | ${2}  | ${0}  | ${0}  | ${0x8000_0000} | ${0}  | ${1}
        ${0x8000_0001} | ${-1} | ${0}  | ${0}  | ${0x8000_0000} | ${0}  | ${0}
        ${0x8000_0001} | ${-2} | ${0}  | ${0}  | ${0x7fff_ffff} | ${0}  | ${1}
        ${0x8000_0001} | ${-2} | ${0}  | ${1}  | ${0x8000_0000} | ${0}  | ${0}
        `;
});
