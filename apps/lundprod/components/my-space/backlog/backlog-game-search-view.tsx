import { Box, Spinner, Text } from '@chakra-ui/react';
import { Game, QUERY_OPERATOR } from '@discord-bot-v2/igdb-front';
import { useState } from 'react';

import { BacklogContext, useBacklog } from '../../../contexts/backlog-context';
import { useFetcher } from '../../../hooks/useFetcher';
import { IGDBFilter, ListGamesSearch } from '../../../utils/types';
import { GamePagination } from '../common/game-pagination';
import { GameSearch } from '../common/game-search';
import { BacklogGameResultView } from './backlog-game-result-view';

export const BacklogGameSearchView = () => {
  const [loadedGames, setLoadedGames] = useState<Game[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const { category, searchValue, platforms } = useBacklog();
  const { post } = useFetcher();

  const onGameSearch = async (_page = 1) => {
    const filters: IGDBFilter[] = [
      {
        field: 'category',
        operator: QUERY_OPERATOR.EQ,
        value: category,
      },
      // To be sure the game has been released at least once
      {
        field: 'first_release_date',
        operator: QUERY_OPERATOR.GT,
        value: 1,
      },
      {
        field: 'first_release_date',
        operator: QUERY_OPERATOR.LTE,
        value: new Date().getTime(),
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
      <GameSearch onSearch={onGameSearch} context={BacklogContext} />

      <Box mt={10}>
        {isLoading && <Spinner />}
        {!isLoading &&
          loadedGames &&
          (loadedGames.length ? (
            <>
              <BacklogGameResultView games={loadedGames} />
              <GamePagination
                currentGameCount={loadedGames.length}
                page={page}
                changePage={changePage}
              />
            </>
          ) : (
            <Text>Aucun résultat n&apos;a été trouvé</Text>
          ))}
      </Box>
    </Box>
  );
};
