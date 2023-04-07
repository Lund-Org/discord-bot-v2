import { Box, Table, Tbody, Th, Thead, Tr } from '@chakra-ui/react';
import { Game } from '@discord-bot-v2/igdb-front';

import { BacklogGameRow } from './backlog-game-row';

type BacklogGameResultProps = {
  games: Game[];
};

export const BacklogGameResultView = ({ games }: BacklogGameResultProps) => {
  return (
    <Box overflow="auto" py={2}>
      <Table>
        <Thead>
          <Tr>
            <Th color="gray.400">Nom</Th>
            <Th color="gray.400">Type</Th>
            <Th color="gray.400">Plate-forme</Th>
            <Th color="gray.400">Date de sortie</Th>
            <Th w="100px" />
          </Tr>
        </Thead>
        <Tbody>
          {games.map((row) => (
            <BacklogGameRow key={row.id} element={row} />
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};
