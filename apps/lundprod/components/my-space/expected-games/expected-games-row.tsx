import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Button,
  Grid,
  GridItem,
  Tag,
  TagLabel,
  Td,
  Text,
  Tr,
} from '@chakra-ui/react';
import { ArrayElement } from '@discord-bot-v2/common';
import {
  Game,
  getPlatformLabel,
  REGION,
  translateGameType,
  translateRegion,
} from '@discord-bot-v2/igdb-front';
import { TFunction } from 'i18next';
import Link from 'next/link';
import { Fragment, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useExpectedGame } from '~/lundprod/contexts/expected-games-context';
import { ExpectedGame } from '~/lundprod/utils/api/expected-games';
import { formatReleaseDate } from '~/lundprod/utils/dates';

type ExpectedGamesRowProps = {
  element: Game;
};

export const ExpectedGamesRow = ({ element }: ExpectedGamesRowProps) => {
  const { t } = useTranslation();
  const { expectedGames } = useExpectedGame();

  const savedExpectedGame = useMemo(() => {
    return expectedGames.find(
      (expectedGame) => expectedGame.igdbId === element.id,
    );
  }, [expectedGames, element]);

  const releaseDateBlock = useMemo(() => {
    const keepFutureFilter = (
      releaseDate: ArrayElement<Game['release_dates']>,
    ) => {
      return releaseDate.date * 1000 > Date.now();
    };

    return (
      element.release_dates.length &&
      element.release_dates.filter(keepFutureFilter).map((releaseDate) => (
        <Fragment key={releaseDate.id}>
          <GridItem display="flex" alignItems="center">
            <Text as="span" mr={2}>
              {getReleaseDateWording(t, releaseDate)}
            </Text>
            <Tag variant="outline" size="sm">
              <TagLabel>
                {translateRegion(t, releaseDate.release_region)}
              </TagLabel>
            </Tag>
          </GridItem>
          <GridItem>
            <PlatformButton
              savedExpectedGame={savedExpectedGame}
              element={element}
              platformId={releaseDate.platform.id}
              region={releaseDate.release_region}
            />
          </GridItem>
        </Fragment>
      ))
    );
  }, [element, savedExpectedGame]);

  return (
    <Tr key={element.id} _hover={{ bg: 'gray.900' }}>
      <Td colSpan={2}>
        <Text noOfLines={1} textOverflow="ellipsis">
          {element.name}
        </Text>
      </Td>
      <Td>
        <Text>{translateGameType(t, element.game_type)}</Text>
      </Td>
      <Td>
        <Link href={element.url} target="_blank" rel="noopener noreferrer">
          <Button size="sm" color="gray.700" rightIcon={<ExternalLinkIcon />}>
            {t('mySpace.expectedGames.list.info')}
          </Button>
        </Link>
      </Td>
      <Td>
        <Grid templateColumns="repeat(2, 1fr)" gap="8px">
          {releaseDateBlock}
        </Grid>
      </Td>
    </Tr>
  );
};

function getReleaseDateWording(
  tFn: TFunction,
  releaseDate?: ArrayElement<Game['release_dates']>,
) {
  return releaseDate
    ? releaseDate.date
      ? formatReleaseDate(new Date(releaseDate.date * 1000))
      : releaseDate.human
    : tFn('mySpace.expectedGames.list.unknownDate');
}

const PlatformButton = ({
  savedExpectedGame,
  element,
  platformId,
  region,
}: {
  savedExpectedGame: ExpectedGame | undefined;
  element: Game;
  platformId: number;
  region: REGION;
}) => {
  const { t } = useTranslation();
  const { removeFromExpectedList, setModalData } = useExpectedGame();

  const platformLabel = useMemo(() => {
    return getPlatformLabel(platformId);
  }, [platformId]);

  return savedExpectedGame &&
    savedExpectedGame.releaseDate.platformId === platformId ? (
    <Button
      size="sm"
      colorScheme="red"
      onClick={() => removeFromExpectedList(element.id)}
    >
      {platformLabel} - {t('mySpace.expectedGames.list.delete')}
    </Button>
  ) : (
    <Button
      size="sm"
      colorScheme="green"
      onClick={() =>
        setModalData({ game: element, platformId, type: 'creation', region })
      }
      isDisabled={!!savedExpectedGame}
    >
      {platformLabel} - {t('mySpace.expectedGames.list.add')}
    </Button>
  );
};
