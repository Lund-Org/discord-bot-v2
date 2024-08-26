import { Box, Spinner, Text } from '@chakra-ui/react';
import { Game, QUERY_OPERATOR } from '@discord-bot-v2/igdb-front';
import { useState } from 'react';

import {
  ExpectedGameContext,
  useExpectedGame,
} from '~/lundprod/contexts/expected-games-context';

import { useFetcher } from '../../../hooks/useFetcher';
import { IGDBFilter, ListGamesSearch } from '../../../utils/types';
import { GamePagination } from '../common/game-pagination';
import { GameSearch } from '../common/game-search';
import { ExpectedGamesResultView } from './expected-games-result-view';
import { useTranslation } from 'react-i18next';

export const ExpectedGamesSearchView = () => {
  const { t } = useTranslation();
  const [loadedGames, setLoadedGames] = useState<Game[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const { category, searchValue, platforms } = useExpectedGame();
  const { post } = useFetcher();

  const onGameSearch = async (_page = 1) => {
    const filters: IGDBFilter[] = [
      {
        field: 'category',
        operator: QUERY_OPERATOR.EQ,
        value: category,
      },
      {
        field: 'release_dates.date',
        operator: QUERY_OPERATOR.GT,
        value: Math.round(Date.now() / 1000),
      },
    ];

    if (platforms.length) {
      filters.push({
        field: 'platforms',
        operator: QUERY_OPERATOR.EQ,
        value: platforms.map((platform) => platform.id),
      });
    }

    const data: ListGamesSearch = {
      search: searchValue.current,
      filters: filters,
    };
    setIsLoading(true);
    setPage(_page);

    return post('/api/games/list', { page }, JSON.stringify(data))
      .then(({ games }) => setLoadedGames(games))
      .catch((err) => {
        console.error(err);
        setLoadedGames([]);
      })
      .finally(() => setIsLoading(false));
  };

  const changePage = (newPage: number) => onGameSearch(newPage);

  return (
    <Box>
      <GameSearch onSearch={onGameSearch} context={ExpectedGameContext} />

      <Box mt={10}>
        {isLoading && <Spinner />}
        {!isLoading &&
          loadedGames &&
          (loadedGames.length ? (
            <>
              <ExpectedGamesResultView games={loadedGames} />
              <GamePagination
                currentGameCount={loadedGames.length}
                page={page}
                changePage={changePage}
              />
            </>
          ) : (
            <Text>{t('mySpace.expectedGames.list.noResult')}</Text>
          ))}
      </Box>
    </Box>
  );
};
