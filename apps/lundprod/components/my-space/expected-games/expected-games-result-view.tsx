import { Box, Table, Tbody, Th, Thead, Tr } from '@chakra-ui/react';
import { Game } from '@discord-bot-v2/igdb-front';

import { ExpectedGamesRow } from './expected-games-row';

type ExpectedGamesResultProps = {
  games: Game[];
};

export const ExpectedGamesResultView = ({
  games,
}: ExpectedGamesResultProps) => {
  return (
    <Box overflow="auto" py={2}>
      <Table>
        <Thead>
          <Tr>
            <Th color="gray.400">Nom</Th>
            <Th color="gray.400">Type</Th>
            <Th color="gray.400">Informations</Th>
            <Th color="gray.400">Date de sortie</Th>
          </Tr>
        </Thead>
        <Tbody>
          {games.map((row) => (
            <ExpectedGamesRow key={row.id} element={row} />
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};
