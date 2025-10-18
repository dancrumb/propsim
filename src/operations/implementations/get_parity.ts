export const get_parity = (v: number): boolean => {
  v ^= v >> 1;
  v ^= v >> 2;
  v = (v & 0x11111111) * 0x11111111;
  return ((v >> 28) & 1) !== 0;
};
