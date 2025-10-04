import { CogRam } from "./CogRam.js";
import { decomposeOpcode } from "./decomposeOpcode.js";

const h32 = (n: number) => n.toString(16).padStart(8, "0");
const h16 = (n: number) => n.toString(16).padStart(4, "0");
const b4 = (n: number) => n.toString(2).padStart(4, "0");

const ram = new MainRam("./test.bin");

const cogRam = new CogRam();

cogRam.loadFromRam(ram, 0x18);

for (let i = 0; i < 0x117; i++) {
  const entry = cogRam.readURegister(i);
  const op = decomposeOpcode(entry);

  if (op === null) {
    console.log(
      `[${h16(i << 2)}] (${h16(
        i
      )}):      \t                                    <${h32(entry)}>`
    );
    continue;
  }

  console.log(
    `[${h16(i << 2)}] (${h16(i)}): ${op.instr}\t${
      op.instr === "CALL" ? "----" : h16(op.dest)
    }, ${h16(op.src)} (ZCRI: ${b4(op.zcri)}; CON: ${b4(op.con)})  <${h32(
      entry
    )}>`
  );
}
