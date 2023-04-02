import { Table, Tbody, Th,Thead, Tr } from '@chakra-ui/react';
import { Game } from '@discord-bot-v2/igdb-front';

import { GameElement } from './game-element';

type GameListProps = {
  games: Game[];
};

export const GameList = ({ games }: GameListProps) => {
  return (
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
          <GameElement key={row.id} element={row} />
        ))}
      </Tbody>
    </Table>
  );
};
