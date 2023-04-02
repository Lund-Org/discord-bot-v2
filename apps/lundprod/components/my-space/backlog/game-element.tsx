import { Tag, Text, Tr, Td, TagLabel, Flex, Button } from '@chakra-ui/react';
import {
  Game,
  translateGameType,
  translateRegion,
} from '@discord-bot-v2/igdb-front';
import { Fragment } from 'react';
import { formatReleaseDate } from '~/lundprod/utils/dates';
import {
  BacklogItemLight,
  useBacklog,
} from '~/lundprod/contexts/backlog-context';
import { ArrayElement } from '@discord-bot-v2/common';

type GameElementProps = {
  element: Game;
};

export const GameElement = ({ element }: GameElementProps) => {
  const { backlog, addToBacklog, removeFromBacklog } = useBacklog();

  return (
    <Tr key={element.id} _hover={{ bg: 'gray.900' }}>
      <Td maxW="500px" textOverflow="ellipsis">
        <Text noOfLines={1}>{element.name}</Text>
      </Td>
      <Td>
        <Text>{translateGameType(element.category)}</Text>
      </Td>
      <Td>
        <Flex gap="5px" flexDir="column">
          {element.platforms?.map((platform) => (
            <Flex key={`platform${platform.id}`} gap="5px" flexDir="column">
              <Text>{platform.name}</Text>
              {/* This is a hack to create empty lines and align platforms with dates */}
              {!!element.release_dates.length &&
                Array.from(
                  {
                    length:
                      getReleaseFromPlatform(platform.id, element.release_dates)
                        .length - 1,
                  },
                  (_, i) => <Text key={`placeholder${i}`}>&nbsp;</Text>
                )}
            </Flex>
          ))}
        </Flex>
      </Td>
      <Td>
        <Flex gap="5px" flexDir="column">
          {element.platforms?.map((platform) => (
            <Fragment key={`fragment${platform.id}`}>
              {getReleaseFromPlatform(platform.id, element.release_dates).map(
                (releaseDate) => (
                  <Flex
                    key={`releaseDate${releaseDate.id}`}
                    gap="5px"
                    whiteSpace="nowrap"
                  >
                    <Text>{getReleaseDateWording(releaseDate)}</Text>
                    <Tag variant="outline" size="sm">
                      <TagLabel>{translateRegion(releaseDate.region)}</TagLabel>
                    </Tag>
                  </Flex>
                )
              )}
            </Fragment>
          ))}
        </Flex>
      </Td>
      <Td>
        {isInBacklog(backlog, element) ? (
          <Button
            size="sm"
            colorScheme="red"
            onClick={() => removeFromBacklog(element.id)}
          >
            Supprimer
          </Button>
        ) : (
          <Button
            size="sm"
            colorScheme="green"
            onClick={() => addToBacklog(element)}
          >
            Ajouter
          </Button>
        )}
      </Td>
    </Tr>
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
