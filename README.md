# PropSim

**PropSim** is an emulator for the Parallax Propeller 1 chip.

You can load up binaries and run your programs on a system that emulates the 8 cogs, the hub, the GPIO pins and the main RAM.

It support stepping one clock tick at a time, or running at a rate of 1 or 2 ticks per second.

## Getting Started

I use `pnpm` for this package, so you'll need to [install that first](https://pnpm.io/installation).

Then, run `pnpm install` to install all the dependencies.

## Usage

To use the emulator, run:

```
pnpm start <location of binary file>
```

This will load the binary into the Propeller. It will then attempt to run the Spin code necessary to start up a cog.

## Controls:

- `t`: advance one clock tick
- `c`: advance one cycle (4 clock ticks)
- `>`: increase autorun speed
- `|`: pause autorun
- `0` - `7`: switch cog
- `↓` and `↑`: Move up and down the Cog RAM
- `Shift + ↑`: Move to start of Cog RAM
- `Shift + P`: Move to PC in Cog RAM
