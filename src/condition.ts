export const CON = {
  0b0000: "NEVER",
  0b0001: "A",
  0b0010: "NC_AND_Z",
  0b0011: "AE",
  0b0100: "C_AND_NZ",
  0b0101: "NE",
  0b0110: "C_NE_Z",
  0b0111: "NC_OR_NZ",
  0b1000: "C_AND_Z",
  0b1001: "C_EQ_Z",
  0b1010: "E",
  0b1011: "NC_OR_Z",
  0b1100: "B",
  0b1101: "C_OR_NZ",
  0b1110: "BE",
  0b1111: "ALWAYS",
} as const;

export type Condition = (typeof CON)[keyof typeof CON];
