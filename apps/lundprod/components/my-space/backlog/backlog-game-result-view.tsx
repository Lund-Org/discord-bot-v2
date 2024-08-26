import { Box, chakra, Table, Tbody, Th, Thead, Tr } from '@chakra-ui/react';
import { Game } from '@discord-bot-v2/igdb-front';

import { BacklogGameRow } from './backlog-game-row';
import { useTranslation } from 'react-i18next';

type BacklogGameResultProps = {
  games: Game[];
};

export const BacklogGameResultView = ({ games }: BacklogGameResultProps) => {
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
          <chakra.col w="250px" />
          <chakra.col w="250px" />
          <chakra.col w="150px" />
        </chakra.colgroup>
        <Thead>
          <Tr>
            <Th colSpan={2} color="gray.400">
              {t('mySpace.backlog.table.header.name')}
            </Th>
            <Th color="gray.400">{t('mySpace.backlog.table.header.type')}</Th>
            <Th color="gray.400">
              {t('mySpace.backlog.table.header.platform')}
            </Th>
            <Th color="gray.400">
              {t('mySpace.backlog.table.header.releaseDate')}
            </Th>
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
