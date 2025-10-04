import { useObservableState } from "observable-hooks";
import { Hub } from "../chip/Hub.js";
import { Box, Text } from "ink";
import React from "react";

const NumberBox = ({ number }: { number: number }) => (
  <Box width={1} height={1}>
    <Text>{number}</Text>
  </Box>
);

export default function HubDisplay({ hub }: { hub: Hub }) {
  const currentHub = useObservableState(hub.currentHub$, 0);

  return (
    <Box
      position="relative"
      borderStyle="round"
      paddingX={1}
      width={9}
      height={7}
    >
      <Box width={5} height={5} flexDirection="column" position="absolute">
        <Box>
          <NumberBox number={7} />
          <Box width={1} height={1}></Box>
          <NumberBox number={0} />
          <Box width={1} height={1}></Box>
          <NumberBox number={1} />
        </Box>
        <Box height={1} width={5}></Box>
        <Box>
          <NumberBox number={6} />
          <Box width={1} height={1}></Box>
          <Box width={1} height={1}></Box>
          <Box width={1} height={1}></Box>
          <NumberBox number={2} />
        </Box>
        <Box height={1} width={5}></Box>
        <Box>
          <NumberBox number={5} />
          <Box width={1} height={1}></Box>
          <NumberBox number={4} />
          <Box width={1} height={1}></Box>
          <NumberBox number={3} />
        </Box>
      </Box>
      <Box width={5} height={5} flexDirection="column">
        <Box height={1} width={5}></Box>
        <Box>
          <Box height={1} width={1}></Box>
          <Box height={1} width={1}>
            {currentHub === 7 && <Text>\</Text>}
          </Box>
          <Box height={1} width={1}>
            {currentHub === 0 && <Text>|</Text>}
          </Box>
          <Box height={1} width={1}>
            {currentHub === 1 && <Text>/</Text>}
          </Box>
          <Box height={1} width={1}></Box>
        </Box>
        <Box>
          <Box width={1} height={1}></Box>
          <Box width={1} height={1}>
            {currentHub === 6 && <Text>-</Text>}
          </Box>
          <Box width={1} height={1}>
            <Text>{currentHub % 2 === 0 ? "+" : "x"}</Text>
          </Box>
          <Box width={1} height={1}>
            {currentHub === 2 && <Text>-</Text>}
          </Box>
          <Box width={1} height={1}></Box>
        </Box>

        <Box>
          <Box width={1} height={1}></Box>
          <Box width={1} height={1}>
            {currentHub === 5 && <Text>/</Text>}
          </Box>
          <Box width={1} height={1}>
            {currentHub === 4 && <Text>|</Text>}
          </Box>
          <Box width={1} height={1}>
            {currentHub === 3 && <Text>\</Text>}
          </Box>
          <Box width={1} height={1}></Box>
        </Box>
        <Box height={1} width={5}></Box>
      </Box>
    </Box>
  );
}
