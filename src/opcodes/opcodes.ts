/**
 * This table is getting a bit silly, so probably needs a refactor, but here's whats up:
 *
 * Each entry has the form:
 *
 * | Instruction Mnemonic | Primary Opcode (6 bits) | Optional ZCRI and CON discriminators |
 *
 * For each loaded instruction, we look to see if the primary opcode matches. If there are
 * discriminators, we check those too. If they match, we have a winner.
 */

const OPCODE_TABLE = [
  ["ABS", 0b101010],
  ["ABSNEG", 0b101011],
  ["ADD", 0b100000],
  ["ADDABS", 0b100010],
  ["ADDS", 0b110100],
  ["ADDSX", 0b110110],
  ["ADDX", 0b110010],
  ["AND", 0b011000],
  ["ANDN", 0b011001],
  ["CALL", 0b010111, [0b0011]],
  ["CLKSET", 0b000011, [0b0001, 0b000]],
  ["CMP", 0b100001, [0b0000]],
  ["CMP", 0b100001, [0b0001]],
  ["CMPS", 0b110000],
  ["CMPSUB", 0b111000],
  ["CMPSX", 0b110001],
  ["CMPX", 0b110011],
  ["COGID", 0b000011, [0b0011, 0b001]],
  ["COGINIT", 0b000011, [0b0001, 0b010]],
  ["COGSTOP", 0b000011, [0b0001, 0b011]],
  ["DJNZ", 0b111001],
  ["HUBOP", 0b000011],
  ["JMP", 0b010111, [0b0001]],
  ["JMP", 0b010111, [0b0000]],
  ["JMPRET", 0b010111, [0b0010]],
  ["JMPRET", 0b010111, [0b0011]],
  ["LOCKCLR", 0b000011, [0b0001, 0b111]],
  ["LOCKNEW", 0b000011, [0b0011, 0b100]],
  ["LOCKRET", 0b000011, [0b0001, 0b101]],
  ["LOCKSET", 0b000011, [0b0001, 0b110]],
  ["MAX", 0b010011],
  ["MAXS", 0b010001],
  ["MIN", 0b010010],
  ["MINS", 0b010000],
  ["MOV", 0b101000],
  ["MOVD", 0b010101],
  ["MOVI", 0b010110],
  ["MOVS", 0b010100],
  ["MUXC", 0b011100],
  ["MUXNC", 0b011101],
  ["MUXNZ", 0b011111],
  ["MUXZ", 0b011110],
  ["NEG", 0b101001],
  ["NEGC", 0b101100],
  ["NEGNC", 0b101101],
  ["NEGNZ", 0b101111],
  ["NEGZ", 0b101110],
  ["OR", 0b011010],
  ["RCL", 0b001101],
  ["RCR", 0b001100],
  ["RDBYTE", 0b000000, [0b0010]],
  ["RDBYTE", 0b000000, [0b0011]],
  ["RDLONG", 0b000010, [0b0010]],
  ["RDLONG", 0b000010, [0b0011]],
  ["RDWORD", 0b000001, [0b0010]],
  ["RDWORD", 0b000001, [0b0011]],
  ["RET", 0b010111, [0b0001]],
  ["REV", 0b001111],
  ["ROL", 0b001001],
  ["ROR", 0b001000],
  ["SAR", 0b001110],
  ["SHL", 0b001011],
  ["SHR", 0b001010],
  ["SUB", 0b100001, [0b0010]],
  ["SUB", 0b100001, [0b0011]],
  ["SUB", 0b100001],
  ["SUBABS", 0b100011],
  ["SUBS", 0b110101],
  ["SUBSX", 0b110111],
  ["SUBX", 0b110011],
  ["SUMC", 0b100100],
  ["SUMNC", 0b100101],
  ["SUMNZ", 0b100111],
  ["SUMZ", 0b100110],
  ["TEST", 0b011000],
  ["TESTN", 0b011001],
  ["TJNZ", 0b111010],
  ["TJZ", 0b111011],
  ["WAITCNT", 0b111110],
  ["WAITPEQ", 0b111100],
  ["WAITPNE", 0b111101],
  ["WAITVID", 0b111111],
  ["WRBYTE", 0b000000, [0b0001]],
  ["WRBYTE", 0b000000, [0b0000]],
  ["WRLONG", 0b000010, [0b0001]],
  ["WRLONG", 0b000010, [0b0000]],
  ["WRWORD", 0b000001, [0b0001]],
  ["WRWORD", 0b000001, [0b0000]],
  ["XOR", 0b011011],
] as const;

export type OpCode = (typeof OPCODE_TABLE)[number][0];

export const isOpCode = (o: string): o is OpCode =>
  OPCODE_TABLE.some((row) => row[0] === o);

export const OP_TO_INSTR: Record<string, number> =
  Object.fromEntries(OPCODE_TABLE);

export const INSTR_TO_OP: [
  instr: number,
  discriminators: ReadonlyArray<number>,
  opCode: OpCode
][] = OPCODE_TABLE.map(
  ([instr, op, discriminators]) =>
    [op, discriminators ?? [], instr] satisfies [
      number,
      ReadonlyArray<number>,
      OpCode
    ]
).sort(([opA], [opB]) => opA - opB);
