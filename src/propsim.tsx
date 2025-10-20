import { render } from "ink";
import React from "react";
import { inspect } from "util";
import { Propeller } from "./chip/Propeller.js";
import { DialogProvider } from "./DialogProvider.js";
import Demo from "./Emulator.js";

const binaryFileName = process.argv[2];

if (!binaryFileName) {
  console.error("Please provide a file name");
  process.exit(1);
}

const propeller = new Propeller(binaryFileName);
process.stderr.write(inspect(propeller.powerOn()) + "\n");

render(
  <DialogProvider>
    <Demo propeller={propeller} />
  </DialogProvider>
);
