/**
 * A handful of utilities for displaying numbers in binary and hex.
 */

export const b8 = (n: number) => (n >>> 0).toString(2).padStart(8, "0");
export const b16 = (n: number) => (n >>> 0).toString(2).padStart(16, "0");
export const b32 = (n: number) => (n >>> 0).toString(2).padStart(32, "0");

export const h8 = (n: number) => (n >>> 0).toString(16).padStart(2, "0");
export const h16 = (n: number) => (n >>> 0).toString(16).padStart(4, "0");
export const h32 = (n: number) => (n >>> 0).toString(16).padStart(8, "0");
