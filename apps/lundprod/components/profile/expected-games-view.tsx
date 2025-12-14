import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Box,
  chakra,
  Divider,
  Flex,
  Grid,
  GridItem,
  Spinner,
  Tag,
  Text,
} from '@chakra-ui/react';
import { getPlatformLabel } from '@discord-bot-v2/igdb-front';
import { keepPreviousData } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import { getNumberParam, getParam } from '~/lundprod/utils/next';
import { trpc } from '~/lundprod/utils/trpc';
import { EXPECTED_ITEMS_PER_PAGE } from '~/lundprod/utils/trpc/constants';

import { Pagination } from './pagination';
import { PlaceholderEmpty } from './placeholder-empty';

export const ExpectedGamesView = () => {
  const { t } = useTranslation();
  const { query, push } = useRouter();
  const discordId = getParam(query.discordId);
  const page = getNumberParam(query.page || '1', 1);

  const { data: games, isFetching } = trpc.getExpectedGames.useQuery(
    {
      page,
      discordId,
    },
    {
      placeholderData: keepPreviousData,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    },
  );

  if (!games?.list.length) {
    return <PlaceholderEmpty />;
  }

  const totalPage = Math.ceil((games?.total || 0) / EXPECTED_ITEMS_PER_PAGE);

  const goToPage = (p: number) => {
    push({ query: { ...query, page: p } }, undefined, {
      shallow: true,
      scroll: true,
    });
  };

  return (
    <Flex flexDir="column" gap={2} mt={6}>
      <Box w="100%" overflowX="auto" position="relative" px="8px">
        {isFetching && (
          <Flex
            position="absolute"
            inset={0}
            zIndex={2}
            pt="150px"
            alignItems="center"
          >
            <Spinner size="lg" />
          </Flex>
        )}
        <Grid
          minW="600px"
          gridTemplateColumns="65px 1fr 200px"
          rowGap="10px"
          alignItems="center"
        >
          {/* header */}
          <GridItem />
          <GridItem>{t('profile.expectedGames.info')}</GridItem>
          <GridItem>{t('profile.expectedGames.releaseDate')}</GridItem>
          <GridItem colSpan={3}>
            <Divider my="6px" />
          </GridItem>
          {/* content */}
          {(games?.list || []).map((game, index) => {
            return (
              <Fragment key={game.id}>
                <GridItem>
                  <Flex
                    h="100%"
                    flexDir="column"
                    justifyContent="center"
                    display="block"
                  >
                    <Text>
                      #{(page - 1) * EXPECTED_ITEMS_PER_PAGE + index + 1}
                    </Text>
                  </Flex>
                </GridItem>
                <GridItem>
                  <Text mb={2}>{game.name}</Text>
                  <Flex alignItems="center" gap={2}>
                    {game.releaseDate && (
                      <Tag variant="outline" size="md" bg="white">
                        {getPlatformLabel(game.releaseDate.platformId)}
                      </Tag>
                    )}
                    <chakra.a
                      display="inline-flex"
                      target="_blank"
                      href={game.url}
                      rel="noopener noreferrer"
                    >
                      <ExternalLinkIcon
                        cursor="pointer"
                        color="gray.500"
                        _hover={{
                          color: 'gray.300',
                        }}
                      />
                    </chakra.a>
                  </Flex>
                </GridItem>
                <GridItem>
                  <Text fontSize={14} fontWeight={600}>
                    {game.releaseDate?.date
                      ? format(new Date(game.releaseDate?.date), 'dd/MM/yyyy')
                      : t('profile.expectedGames.unknown')}
                  </Text>
                </GridItem>
                <GridItem colSpan={3}>
                  <Divider my="12px" />
                </GridItem>
              </Fragment>
            );
          })}
        </Grid>
      </Box>
      {(games?.total || 0) > EXPECTED_ITEMS_PER_PAGE && (
        <Pagination
          page={page}
          totalPage={totalPage}
          isLoading={isFetching}
          goToPage={goToPage}
        />
      )}
    </Flex>
  );
};
