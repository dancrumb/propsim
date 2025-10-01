import { MainRam } from "./MainRam.js";
import { CogRam } from "./CogRam.js";

const ram = new MainRam("test.bin");

console.log(ram);

console.log(ram.readLong(0x10).toString(16));

const cogRam = new CogRam();
cogRam.loadFromRam(ram, 0x10);

console.log(cogRam.readURegister(0).toString(16));
