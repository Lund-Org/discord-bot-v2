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
import { REGION } from '@discord-bot-v2/igdb';
import { Fragment, useMemo } from 'react';
import { formatReleaseDate } from '~/lundprod/utils/dates';
import { IGDBGame, IGDBReleaseDates } from '~/lundprod/utils/types';
import {
  BacklogItemLight,
  useBacklog,
} from '~/lundprod/contexts/backlog-context';

type GameListProps = {
  games: IGDBGame[];
};

type GameRow = {
  id: number;
  name: string;
  category: string;
  platforms: { name: string; releaseDates: [string, REGION][] }[];
  url: string;
};

export const GameList = ({ games }: GameListProps) => {
  const { backlog, addToBacklog, removeFromBacklog } = useBacklog();
  const rows = useMemo<GameRow[]>(() => {
    const builtRow: GameRow[] = [];

    games.forEach((game) => {
      if ((game.platforms || []).length === 0) {
        builtRow.push({
          id: game.id,
          name: game.name,
          category: game.category,
          platforms: [{ name: 'Inconnue', releaseDates: [] }],
          url: game.url,
        });
      } else {
        const row = {
          id: game.id,
          name: game.name,
          category: game.category,
          platforms: [],
          url: game.url,
        };

        game.platforms.forEach((platform) => {
          // To ignore old platform not registered in my platforms
          if (!platform) {
            return;
          }

          const dates = game.releaseDates
            .filter((releaseDate) => releaseDate.platform?.id === platform.id)
            .map((releaseDatePerRegion): [string, REGION] => {
              return [
                getReleaseDateWording(releaseDatePerRegion),
                releaseDatePerRegion.region,
              ];
            });

          row.platforms.push({
            name: platform.abbreviation || platform.name,
            releaseDates: dates,
          });
        });
        builtRow.push(row);
      }
    });

    return builtRow;
  }, [games]);

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
        {rows.map((row, index) => (
          <Tr key={`row${index}`} _hover={{ bg: 'gray.900' }}>
            <Td maxW="500px" textOverflow="ellipsis">
              <Text noOfLines={1}>{row.name}</Text>
            </Td>
            <Td>
              <Text>{row.category}</Text>
            </Td>
            <Td>
              <Flex gap="5px" flexDir="column">
                {row.platforms.map((platform, platformIndex) => (
                  <Flex
                    key={`platform${platformIndex}`}
                    gap="5px"
                    flexDir="column"
                  >
                    <Text>{platform.name}</Text>
                    {/* This is a hack to create empty lines and align platforms with dates */}
                    {!!platform.releaseDates.length &&
                      Array.from(
                        { length: platform.releaseDates.length - 1 },
                        (_, i) => <Text key={`placeholder${i}`}>&nbsp;</Text>
                      )}
                  </Flex>
                ))}
              </Flex>
            </Td>
            <Td>
              <Flex gap="5px" flexDir="column">
                {row.platforms?.map(({ releaseDates }, index) => (
                  <Fragment key={`fragment${index}`}>
                    {releaseDates.map(([date, region], releaseDateIndex) => (
                      <Flex
                        key={`releaseDate${releaseDateIndex}`}
                        gap="5px"
                        whiteSpace="nowrap"
                      >
                        <Text>{date}</Text>
                        <Tag variant="outline" size="sm">
                          <TagLabel>{region}</TagLabel>
                        </Tag>
                      </Flex>
                    ))}
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

function getReleaseDateWording(releaseDate?: IGDBReleaseDates) {
  return releaseDate
    ? releaseDate.date
      ? formatReleaseDate(new Date(releaseDate.date * 1000))
      : releaseDate.human
    : 'Inconnue';
}

function isInBacklog(backlogList: BacklogItemLight[], game: GameRow) {
  return !!backlogList.find(({ igdbGameId }) => igdbGameId === game.id);
}
