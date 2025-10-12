# Sidetrack F: How the instruction pipeline works

This is from https://www.rayslogic.com/propeller/programming/DeSilvaAssemblyTutorial.pdf

So you have learnt that most Propeller instructions take 4 ticks (which is 50 ns @ 80 MHz); even I told you so. Well, I am sorry: That was a lie!

A “standard” instruction takes 6 ticks:

| T   | Action                        |
| --- | ----------------------------- |
| 0   | Fetch Instruction             |
| 1   | Decode instruction            |
| 2   | Fetch „dest“ operand          |
| 3   | Fetch „source“ operand        |
| 4   | Perform operation             |
| 5   | Store result back into “dest” |

You can see that most of the time passes in accessing the COG memory (T=0,2,3,5).
One could think, it should be nice to skip some of those time slots, if there is no source operand to fetch, because we have an “immediate” instruction (T=3); or T=5, if we do not store back anything.

But the Propeller – like most other advanced processors – uses a completely different approach to speed things up: it “interleaves” memory accesses for the NEXT instruction in the gaps (T=1 and 4), where the memory is not used for the CURRENT instruction. This will look like this:

| T   | CURRENT instruction      | LAST/NEXT instruction             |
| --- | ------------------------ | --------------------------------- |
| -1  |                          | Fetch "source" for LAST operation |
| 0   | Fetch Instruction        | Perform LAST operation            |
| 1   | Decode instruction       | Store result back into "dest"     |
| 2   | Fetch „dest“ operand     |                                   |
| 3   | Fetch „source“ operand   |                                   |
| 4   | Perform operation        | Fetch NEXT instruction            |
| 5   | Store result into "dest" | Decode NEXT instruction           |
| 6   |                          | Fetch "dest" for NEXT instruction |

There is no way to do it better ! The memory is now used in every cycle; and a new instruction is fetched every 4th cycle.
You can now understand, why it will not work to patch the NEXT instruction, as this is fetched at T=4, whereas the patch only happens at T=5!

And it is important to uphold this inter-locking!

However there are two kinds of instructions that cannot be “locked-in”, as they will take an unknown amount of time. One is the WAIT-family, the timing of which is something like this:

| T   | Action                        |
| --- | ----------------------------- |
| 0   | Fetch WAIT instruction        |
| 1   | Decode instruction            |
| 2   | Fetch "dest" operand          |
| 3   | Fetch "source" operand        |
| 3+N | Wait zero to N ticks          |
| 4+N | Store result back into "dest" |

Without any wait, this will take 5 ticks. There is no interleave of the NEXT instruction; the fetch of
the NEXT instruction will be performed only at T=5+N

Now wait! A "standard" instruction takes 6 ticks, a "waitless wait" just 5; shouldn't it then take just 3
ticks in the context of the pipe flow?

Very clever! But being so "variable" WAIT (and a HUB instruction) is not locked in the pipeline!
The fetch of the next instruction – which happens at T = 4 for a standard instruction - does not
happen at T = 3+N but at T = 5+N only – or so it seems...

The other exception is the HUB-family. The timing of an RDLONG is something like this:

| T   | Action                                |
| --- | ------------------------------------- |
| 0   | Fetch HUB-instruction                 |
| 1   | Decode instruction                    |
| 2   | Fetch "dest" operand                  |
| 3   | Fetch "source" operand                |
| 3+N | Wait zero to 15 ticks for HUB to sync |
| 4+N | Address HUB                           |
| 5+N | LOAD/STORE to/from HUB                |
| 6+N | Store result back into “dest”         |

We can now also try to understand the timing of a conditional jump instructions; The processor always "predicts" a jump will be taken and fetches the NEXT instruction from this address at T = 4. If the instruction "falls through", this was a bad prediction, and the fetch has to be repeated at T = 6. However T = 6 is not meant to be a "fetch" phase, as the jumps are locked into the pipe, in contrast to the WAIT and HUB instructions. And the next "scheduled fetch" is T=8 ...

**Note** The mechanism presented here is not well described in official Parallax documents and depends mostly on my own “educated guesses”.
