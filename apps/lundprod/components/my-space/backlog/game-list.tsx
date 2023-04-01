import {
  Tag,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TagLabel,
  Flex,
  Button,
} from '@chakra-ui/react';
import { Game, translateGameType, translateRegion } from '@discord-bot-v2/igdb';
import { Fragment } from 'react';
import { formatReleaseDate } from '~/lundprod/utils/dates';
import {
  BacklogItemLight,
  useBacklog,
} from '~/lundprod/contexts/backlog-context';
import { ArrayElement } from '~/lundprod/utils/types';

type GameListProps = {
  games: Game[];
};

export const GameList = ({ games }: GameListProps) => {
  const { backlog, addToBacklog, removeFromBacklog } = useBacklog();

  return (
    <Table>
      <Thead>
        <Tr>
          <Th color="gray.400">Nom</Th>
          <Th color="gray.400">Type</Th>
          <Th color="gray.400">Plate-forme</Th>
          <Th color="gray.400">Date de sortie</Th>
          <Th w="100px"></Th>
        </Tr>
      </Thead>
      <Tbody>
        {games.map((row, index) => (
          <Tr key={row.id} _hover={{ bg: 'gray.900' }}>
            <Td maxW="500px" textOverflow="ellipsis">
              <Text noOfLines={1}>{row.name}</Text>
            </Td>
            <Td>
              <Text>{translateGameType(row.category)}</Text>
            </Td>
            <Td>
              <Flex gap="5px" flexDir="column">
                {row.platforms?.map((platform) => (
                  <Flex
                    key={`platform${platform.id}`}
                    gap="5px"
                    flexDir="column"
                  >
                    <Text>{platform.name}</Text>
                    {/* This is a hack to create empty lines and align platforms with dates */}
                    {!!row.release_dates.length &&
                      Array.from(
                        {
                          length:
                            getReleaseFromPlatform(
                              platform.id,
                              row.release_dates
                            ).length - 1,
                        },
                        (_, i) => <Text key={`placeholder${i}`}>&nbsp;</Text>
                      )}
                  </Flex>
                ))}
              </Flex>
            </Td>
            <Td>
              <Flex gap="5px" flexDir="column">
                {row.platforms?.map((platform) => (
                  <Fragment key={`fragment${platform.id}`}>
                    {getReleaseFromPlatform(platform.id, row.release_dates).map(
                      (releaseDate, releaseDateIndex) => (
                        <Flex
                          key={`releaseDate${releaseDate.id}`}
                          gap="5px"
                          whiteSpace="nowrap"
                        >
                          <Text>{getReleaseDateWording(releaseDate)}</Text>
                          <Tag variant="outline" size="sm">
                            <TagLabel>
                              {translateRegion(releaseDate.region)}
                            </TagLabel>
                          </Tag>
                        </Flex>
                      )
                    )}
                  </Fragment>
                ))}
              </Flex>
            </Td>
            <Td>
              {isInBacklog(backlog, row) ? (
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => removeFromBacklog(row.id)}
                >
                  Supprimer
                </Button>
              ) : (
                <Button
                  size="sm"
                  colorScheme="green"
                  onClick={() => addToBacklog(row)}
                >
                  Ajouter
                </Button>
              )}
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

function getReleaseDateWording(
  releaseDate?: ArrayElement<Game['release_dates']>
) {
  return releaseDate
    ? releaseDate.date
      ? formatReleaseDate(new Date(releaseDate.date * 1000))
      : releaseDate.human
    : 'Inconnue';
}

function isInBacklog(backlogList: BacklogItemLight[], game: { id: number }) {
  return !!backlogList.find(({ igdbGameId }) => igdbGameId === game.id);
}

function getReleaseFromPlatform(
  platformId: number,
  releaseDates: Game['release_dates'] = []
) {
  return releaseDates.filter(({ platform }) => platform.id === platformId);
}
