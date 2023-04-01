import { Box, Spinner, Text } from '@chakra-ui/react';
import { QUERY_OPERATOR, Game } from '@discord-bot-v2/igdb';
import { useState } from 'react';
import { GameSearch } from '~/lundprod/components/my-space/backlog/game-search';
import { IGDBFilter, ListGamesSearch } from '~/lundprod/utils/types';
import { useBacklog } from '~/lundprod/contexts/backlog-context';
import { GameList } from '~/lundprod/components/my-space/backlog/game-list';
import { GamePagination } from '~/lundprod/components/my-space/backlog/game-pagination';
import { useFetcher } from '~/lundprod/hooks/useFetcher';

export const GameChoiceTab = () => {
  const [loadedGames, setLoadedGames] = useState<Game[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const { category, searchValue, platforms } = useBacklog();
  const fetcher = useFetcher();

  const onGameSearch = async (_page = 1) => {
    const filters: IGDBFilter[] = [
      {
        field: 'category',
        operator: QUERY_OPERATOR.EQ,
        value: category,
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

    return fetcher(
      '/api/games/list',
      { page },
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    )
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
      <GameSearch onSearch={onGameSearch} />

      <Box mt={10}>
        {isLoading && <Spinner />}
        {!isLoading &&
          loadedGames &&
          (loadedGames.length ? (
            <>
              <GameList games={loadedGames} />
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
