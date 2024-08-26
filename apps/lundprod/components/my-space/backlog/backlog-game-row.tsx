import { Button, Flex, Tag, TagLabel, Td, Text, Tr } from '@chakra-ui/react';
import { ArrayElement } from '@discord-bot-v2/common';
import {
  Game,
  translateGameType,
  translateRegion,
} from '@discord-bot-v2/igdb-front';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import {
  BacklogItemLight,
  useBacklog,
} from '~/lundprod/contexts/backlog-context';
import { formatReleaseDate } from '~/lundprod/utils/dates';

type BacklogGameRowProps = {
  element: Game;
};

export const BacklogGameRow = ({ element }: BacklogGameRowProps) => {
  const { t } = useTranslation();
  const { backlog, addToBacklog, removeFromBacklog } = useBacklog();

  return (
    <Tr key={element.id} _hover={{ bg: 'gray.900' }}>
      <Td colSpan={2}>
        <Text noOfLines={1} textOverflow="ellipsis">
          {element.name}
        </Text>
      </Td>
      <Td>
        <Text>{translateGameType(t, element.category)}</Text>
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
                  (_, i) => <Text key={`placeholder${i}`}>&nbsp;</Text>,
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
                      <TagLabel>
                        {translateRegion(t, releaseDate.region)}
                      </TagLabel>
                    </Tag>
                  </Flex>
                ),
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
            {t('mySpace.backlog.table.delete')}
          </Button>
        ) : (
          <Button
            size="sm"
            colorScheme="green"
            onClick={() => addToBacklog(element)}
          >
            {t('mySpace.backlog.table.add')}
          </Button>
        )}
      </Td>
    </Tr>
  );
};

function getReleaseDateWording(
  releaseDate?: ArrayElement<Game['release_dates']>,
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
  releaseDates: Game['release_dates'] = [],
) {
  return releaseDates.filter(({ platform }) => platform.id === platformId);
}
