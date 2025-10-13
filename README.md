# PropSim

**PropSim** is an emulator for the Parallax Propeller 1 chip.

You can load up binaries and run your programs on a system that emulates the 8 cogs, the hub, the GPIO pins and the main RAM.

It support stepping one clock tick at a time, or running at a rate of 1 or 2 ticks per second.

## Usage

To use the emulator, run:

```
pnpm start <location of binary file>
```

This will load the binary into the Propeller. It will then attempt to run the Spin code necessary to start up a cog.

## Controls:

- `t`: advance one clock tick
- `>`: increase autorun speed
- `|`: pause autorun
- `0` - `7`: switch cog
