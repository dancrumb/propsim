import { MainRam } from "./chip/MainRam.js";
import { decodeOpcode } from "./opcodes/decodeOpcode.js";
import { renderOperation } from "./opcodes/OperationStructure.js";

/**
 * Just a quick and dirty script to read a chip binary and show its
 * contents in a human-readable form.
 */

const args = process.argv.slice(2);

if (args.length < 1) {
  console.error("Usage: readbin <filename> [offset]");
  process.exit(1);
}

const ram = new MainRam(args[0] ?? "");

const offset = args.length >= 2 ? parseInt(args[1] ?? "0", 16) : 0;
const length = args.length >= 3 ? parseInt(args[2] ?? "256", 10) : 256;

for (let i = offset; i < offset + length; i += 1) {
  const val = ram.readLong(i * 4);
  const op = decodeOpcode(val);
  process.stdout.write(
    `[${(i * 4).toString(16).toUpperCase().padStart(4, "0")}] `
  );
  if (op === null) {
    process.stdout.write("");
  } else {
    process.stdout.write(renderOperation(op));
  }
  process.stdout.write(` <${val.toString(16).toUpperCase().padStart(8, "0")}>`);
  process.stdout.write("\n");
}
process.stdout.write("\n");
