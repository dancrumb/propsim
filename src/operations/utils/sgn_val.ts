export const sgn_val = (value: number): number => {
  let result = value;
  if (result >>> 0 === 0x8000_0000) {
    return -2147483648;
  }
  if ((result & 0x8000_0000) !== 0) {
    result = -((~result + 1) & 0xffffffff);
  }
  return result;
};
