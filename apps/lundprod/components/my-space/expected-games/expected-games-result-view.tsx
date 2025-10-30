import { Box, chakra, Table, Tbody, Th, Thead, Tr } from '@chakra-ui/react';
import { Game } from '@discord-bot-v2/igdb-front';

import { ExpectedGamesRow } from './expected-games-row';
import { useTranslation } from 'react-i18next';

type ExpectedGamesResultProps = {
  games: Game[];
};

export const ExpectedGamesResultView = ({
  games,
}: ExpectedGamesResultProps) => {
  const { t } = useTranslation();

  return (
    <Box overflow="auto" py={2}>
      <Table
        sx={{
          '&': {
            'table-layout': 'fixed',
          },
        }}
      >
        <chakra.colgroup>
          <chakra.col />
          <chakra.col w="200px" />
          <chakra.col w="120px" />
          <chakra.col w="200px" />
          <chakra.col w="400px" />
        </chakra.colgroup>
        <Thead>
          <Tr>
            <Th colSpan={2} color="gray.400">
              {t('mySpace.expectedGames.list.table.name')}
            </Th>
            <Th color="gray.400">
              {t('mySpace.expectedGames.list.table.type')}
            </Th>
            <Th color="gray.400">
              {t('mySpace.expectedGames.list.table.info')}
            </Th>
            <Th color="gray.400">
              {t('mySpace.expectedGames.list.table.releaseDate')}
            </Th>
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
