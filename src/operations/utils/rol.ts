export const rol = (value: number, shift: number): number => {
  const bits = 32;
  shift = shift % bits;
  return ((value << shift) | (value >>> (bits - shift))) >>> 0;
};
