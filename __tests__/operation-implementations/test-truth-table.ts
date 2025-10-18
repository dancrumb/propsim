import { expect, test } from "vitest";
import { op } from "../../src/opcodes/encodeOpcode";
import { OpCode } from "../../src/opcodes/opcodes";
import { Operation } from "../../src/Operation";
import { BaseOperation } from "../../src/operations/BaseOperation";
import { getTestCog } from "./getTestCog";
import { runOperation } from "./runOperation";

export const testTruthTable =
  (
    operation: new (
      ...conParams: ConstructorParameters<typeof BaseOperation>
    ) => Operation
  ) =>
  (...args: [TemplateStringsArray, ...any]) => {
    test.each(...args)(
      `${operation.name.replace(
        "Operation",
        ""
      )} dest:$dest src:$src results in $result with Z:$z C:$c`,
      async ({
        src,
        dest,
        result,
        z,
        c,
      }: {
        src: number;
        dest: number;
        result: number;
        z: 1 | 0;
        c: 1 | 0;
      }) => {
        const cog = getTestCog();

        cog.writeRegister(0x10, dest);
        cog.writeRegister(0x20, src);
        await runOperation(
          new operation(
            op(
              operation.name.replace("Operation", "") as OpCode | "NOP",
              0b1110,
              "ALWAYS",
              0x10,
              0x20
            ),
            cog
          )
        );

        expect(cog.readRegister(0x10) >>> 0).toBe(result >>> 0);
        expect(cog.Z).toBe(z === 1);
        expect(cog.C).toBe(c === 1);
      }
    );
  };
