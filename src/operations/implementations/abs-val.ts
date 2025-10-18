export const abs_val = (value: number): number => {
  let result = value;
  if ((result & 0x8000_0000) !== 0) {
    result--;
    result = ~result;
  }
  return result;
};
