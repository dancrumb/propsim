import { Box, Text } from "ink";
import { useObservableState } from "observable-hooks";
import React from "react";
import { Hub } from "../chip/Hub.js";

const NumberBox = ({
  number,
  pending,
}: {
  number: number;
  pending: boolean;
}) => (
  <Box width={1} height={1}>
    <Text color={pending ? "brightwhite" : "gray"}>{number}</Text>
  </Box>
);

export default function HubDisplay({ hub }: { hub: Hub }) {
  const currentHub = useObservableState(hub.currentHub$, 0);
  const pendingOperations = useObservableState(hub.pendingOperations$, []);

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
          <NumberBox number={7} pending={pendingOperations[7] !== undefined} />
          <Box width={1} height={1}></Box>
          <NumberBox number={0} pending={pendingOperations[0] !== undefined} />
          <Box width={1} height={1}></Box>
          <NumberBox number={1} pending={pendingOperations[1] !== undefined} />
        </Box>
        <Box height={1} width={5}></Box>
        <Box>
          <NumberBox number={6} pending={pendingOperations[6] !== undefined} />
          <Box width={1} height={1}></Box>
          <Box width={1} height={1}></Box>
          <Box width={1} height={1}></Box>
          <NumberBox number={2} pending={pendingOperations[2] !== undefined} />
        </Box>
        <Box height={1} width={5}></Box>
        <Box>
          <NumberBox number={5} pending={pendingOperations[5] !== undefined} />
          <Box width={1} height={1}></Box>
          <NumberBox number={4} pending={pendingOperations[4] !== undefined} />
          <Box width={1} height={1}></Box>
          <NumberBox number={3} pending={pendingOperations[3] !== undefined} />
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
