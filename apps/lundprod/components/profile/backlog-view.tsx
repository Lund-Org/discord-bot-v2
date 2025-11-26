import { keepPreviousData } from '@tanstack/react-query';
import { ChatIcon, ExternalLinkIcon, StarIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  chakra,
  Divider,
  Flex,
  Grid,
  GridItem,
  Show,
  Spinner,
  TabPanel,
  TabPanels,
  Tag,
  Text,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { omit } from 'lodash';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import z from 'zod';

import { getNumberParam, getParam } from '~/lundprod/utils/next';
import { trpc } from '~/lundprod/utils/trpc';
import { backlogItemSchema } from '~/lundprod/server/common-schema';
import { BACKLOG_ITEMS_PER_PAGE } from '~/lundprod/utils/trpc/constants';

import { QueryTabs } from '../tabs';
import { BacklogReviewDrawer } from './backlog-review-drawer';
import { PlaceholderEmpty } from './placeholder-empty';
import { Pagination } from './pagination';

type BacklogGame = z.infer<typeof backlogItemSchema>;

enum TABS {
  BACKLOG = 'backlog',
  IN_PROGRESS = 'in-progress',
  FINISHED = 'finished',
  ABANDONED = 'abandoned',
  WISHLIST = 'wishlist',
}

type BacklogViewProps = {
  username: string;
  discordId: string;
};

export const BacklogView = ({ username, discordId }: BacklogViewProps) => {
  const { t } = useTranslation();
  const { query, push } = useRouter();
  const firstRendering = useRef(true);

  const page = getNumberParam(query.page || '1', 1);
  const igdbGameId = getNumberParam(query.igdbGameId || '0', 0);
  const currentStatus = getParam(query.status, TABS.BACKLOG);

  const [reviewedItem, setReviewedItem] = useState<BacklogGame | null>(null);

  const { data: backlogItemRetrieved, isError } =
    trpc.getBacklogItemByGameId.useQuery(
      {
        gameId: igdbGameId,
        discordId,
      },
      {
        // first rendering is there to only fetch on landing on the page
        enabled: !!igdbGameId && firstRendering.current,
      },
    );

  // when item is fetched, set reviewed item, on error remove the query param
  useEffect(() => {
    firstRendering.current = false;
    if (backlogItemRetrieved?.backlogItem) {
      setReviewedItem(backlogItemRetrieved.backlogItem);
    } else if (isError) {
      push({ query: omit(query, 'igdbGameId') }, undefined, {
        shallow: true,
      });
    }
  }, [backlogItemRetrieved?.backlogItem, isError, query, push]);

  useEffect(() => {
    if (reviewedItem && !query.igdbGameId) {
      push(
        { query: { ...query, igdbGameId: reviewedItem.igdbGameId } },
        undefined,
        {
          shallow: true,
        },
      );
    }
  }, [reviewedItem, query, push]);

  return (
    <>
      <QueryTabs
        queryName={'status'}
        values={Object.values(TABS)}
        tabs={{
          [TABS.BACKLOG]: t('profile.tabs.backlog'),
          [TABS.IN_PROGRESS]: t('profile.tabs.inProgress'),
          [TABS.FINISHED]: t('profile.tabs.finished'),
          [TABS.ABANDONED]: t('profile.tabs.abandoned'),
          [TABS.WISHLIST]: t('profile.tabs.wishlist'),
        }}
        defaultValue={TABS.BACKLOG}
        tabsProps={{ colorScheme: 'teal', variant: 'enclosed' }}
        customProcessOnTabChange={(url) => {
          if (url.searchParams.get('status') !== currentStatus) {
            url.searchParams.set('page', '1');
          }

          return url;
        }}
        tabProps={{
          sx: {
            '&[aria-selected="true"]': {
              bg: 'whiteAlpha.900',
              fontWeight: 600,
            },
          },
        }}
      >
        <TabPanels>
          <TabPanel>
            <GameTable
              status="BACKLOG"
              page={currentStatus === TABS.BACKLOG ? page : 1}
              dateLabel={t('profile.backlog.createdAt')}
              dateField={'createdAt'}
            />
          </TabPanel>
          <TabPanel>
            <GameTable
              status="CURRENTLY"
              page={currentStatus === TABS.IN_PROGRESS ? page : 1}
              dateLabel={t('profile.backlog.startedAt')}
              dateField={'startedAt'}
            />
          </TabPanel>
          <TabPanel>
            <GameTable
              status="FINISHED"
              page={currentStatus === TABS.FINISHED ? page : 1}
              dateLabel={t('profile.backlog.finishedAt')}
              dateField={'finishedAt'}
              onReview={(x) => setReviewedItem(x)}
            />
          </TabPanel>
          <TabPanel>
            <GameTable
              status="ABANDONED"
              page={currentStatus === TABS.ABANDONED ? page : 1}
              dateLabel={t('profile.backlog.abandonedAt')}
              dateField={'abandonedAt'}
              onReview={(x) => setReviewedItem(x)}
            />
          </TabPanel>
          <TabPanel>
            <GameTable
              status="WISHLIST"
              page={currentStatus === TABS.WISHLIST ? page : 1}
              dateLabel={t('profile.backlog.wishlistedAt')}
              dateField={'wishlistAt'}
            />
          </TabPanel>
        </TabPanels>
      </QueryTabs>
      <BacklogReviewDrawer
        item={reviewedItem}
        closeReview={() => setReviewedItem(null)}
        userName={username}
      />
    </>
  );
};

type GameTableProps = {
  // To sync with BacklogStatus
  status: 'BACKLOG' | 'CURRENTLY' | 'FINISHED' | 'ABANDONED' | 'WISHLIST';
  page: number;
  dateLabel: string;
  dateField: keyof Pick<
    BacklogGame,
    'abandonedAt' | 'createdAt' | 'finishedAt' | 'startedAt' | 'wishlistAt'
  >;
  onReview?: (x: BacklogGame) => void;
};

const GameTable = ({
  status,
  page,
  dateLabel,
  dateField,
  onReview,
}: GameTableProps) => {
  const { t } = useTranslation();
  const { query, push } = useRouter();
  const discordId = getParam(query.discordId);

  const withRating = status === 'FINISHED' || status === 'ABANDONED';

  const { data: games, isFetching } = trpc.getBacklog.useQuery(
    {
      category: status,
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

  const totalPage = Math.ceil((games?.total || 0) / BACKLOG_ITEMS_PER_PAGE);

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
          gridTemplateColumns={
            withRating ? '65px 1fr 200px 150px max-content' : '65px 1fr 200px'
          }
          rowGap="10px"
          alignItems="center"
        >
          {/* header */}
          <GridItem />
          <GridItem>{t('profile.backlog.info')}</GridItem>
          <GridItem>{dateLabel}</GridItem>
          {withRating && <GridItem>{t('profile.backlog.note')}</GridItem>}
          {withRating && <GridItem>{t('profile.backlog.actions')}</GridItem>}
          <GridItem colSpan={withRating ? 5 : 3}>
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
                      #{(page - 1) * BACKLOG_ITEMS_PER_PAGE + index + 1}
                    </Text>
                  </Flex>
                </GridItem>
                <GridItem>
                  <Text mb={2}>{game.name}</Text>
                  <Flex alignItems="center" gap={2}>
                    <Tag variant="outline" size="md" bg="white">
                      {game.game_type}
                    </Tag>
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
                    {game[dateField] &&
                      format(new Date(game[dateField]), 'dd/MM/yyyy')}
                  </Text>
                </GridItem>
                {withRating && (
                  <GridItem>
                    <Flex alignItems="center" gap={1}>
                      {Array.from({ length: 5 }, (_, index) => (
                        <StarIcon
                          key={index}
                          color={
                            index + 1 <= (game.backlogItemReview?.rating || 0)
                              ? 'gold'
                              : 'gray.300'
                          }
                          boxSize="20px"
                        />
                      ))}
                    </Flex>
                  </GridItem>
                )}
                {withRating && (
                  <GridItem>
                    <Flex gap={2} flexWrap="wrap">
                      <Button
                        colorScheme="orange"
                        leftIcon={<ChatIcon />}
                        iconSpacing={{ base: 0, md: 2 }}
                        onClick={() => onReview?.(game)}
                      >
                        <Show above="md">{t('profile.backlog.review')}</Show>
                      </Button>
                    </Flex>
                  </GridItem>
                )}
                <GridItem colSpan={withRating ? 5 : 3}>
                  <Divider my="12px" />
                </GridItem>
              </Fragment>
            );
          })}
        </Grid>
      </Box>
      {(games?.total || 0) > BACKLOG_ITEMS_PER_PAGE && (
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
