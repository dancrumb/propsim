import { Box, Newline, Text } from "ink";
import React, { Fragment, useEffect } from "react";
import { WatchLocations } from "../ObservableBuffer.js";
import { h16, h32, h8 } from "../utils/val-display.js";
import type { Watch } from "./Watch.js";

export function WatchEntry({
  watch,
  data,
  selected = false,
}: {
  watch: Watch;
  data: number[];
  selected?: boolean;
}) {
  const previousDataRef = React.useRef<number[] | null>(null);

  const changed: boolean[] = React.useMemo(() => {
    return data.map(
      (value, index) =>
        previousDataRef.current !== null &&
        data.length === previousDataRef.current.length &&
        value !== previousDataRef.current[index]
    );
  }, [data]);

  useEffect(() => {
    previousDataRef.current = data;
  }, [data]);

  return (
    <Box
      key={watch.id}
      flexDirection="column"
      alignItems="flex-start"
      paddingX={1}
    >
      <Box backgroundColor={selected ? "magenta" : "grey"} width={"80%"}>
        <Text>
          {WatchLocations[watch.location]}[{h16(watch.from)}-{h16(watch.to)}] as{" "}
          {watch.as}
        </Text>
      </Box>
      <Box>
        <Text>
          {data.map((v: number, i: number) => (
            <Fragment key={i}>
              <Text backgroundColor={changed[i] ? "yellow" : "black"}>
                {watch.as === "BYTE"
                  ? h8(v)
                  : watch.as === "WORD"
                  ? h16(v)
                  : h32(v)}
              </Text>
              {(i + 1) %
                (watch.as === "BYTE" ? 16 : watch.as === "WORD" ? 8 : 4) ===
              0 ? (
                <Newline />
              ) : i === data.length - 1 ? (
                <Text></Text>
              ) : (
                <Text>:</Text>
              )}
            </Fragment>
          ))}
        </Text>
      </Box>
    </Box>
  );
}
