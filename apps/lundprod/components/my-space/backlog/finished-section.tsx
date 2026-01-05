import { EditIcon, ExternalLinkIcon, SettingsIcon } from '@chakra-ui/icons';
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
  Tag,
  Text,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { sortBy } from 'lodash';
import { Fragment, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { BacklogGame, useMe } from '~/lundprod/contexts/me.context';
import { useBacklogHooks } from '~/lundprod/hooks/my-space/use-backlog-hooks';

import { ChangeStateModal } from './change-state-modal';
import { EmptyPlaceholder } from './empty-placeholder';
import { ReorderControl } from './reorder-control';
import { ReviewModal } from './review-modal/review-modal';
import { SortByDateButton } from './sort-by-date-button';

const STATUS: BacklogGame['status'] = 'FINISHED';

export const FinishedSection = () => {
  const { t } = useTranslation();
  const { backlogByStatus } = useMe();

  const {
    changeStatusBacklogItemId,
    setChangeStatusBacklogItemId,
    updateReviewBacklogItemId,
    setUpdateReviewBacklogItemId,
    sortByName,
    sortByDate,
    onArrowClick,
    moveToPosition,
    isSortIsLoading,
  } = useBacklogHooks();

  const games = useMemo(
    () => sortBy(backlogByStatus[STATUS] || [], 'order'),
    [backlogByStatus],
  );

  if (games.length === 0) {
    return (
      <EmptyPlaceholder
        title={t('myBacklog.placeholder.finished.title')}
        description={t('myBacklog.placeholder.finished.description')}
      />
    );
  }

  return (
    <Flex flexDir="column" gap={2}>
      <Flex gap={2} alignItems="center">
        <Text>{t('myBacklog.autosort.text')}</Text>
        <Button onClick={() => sortByName(STATUS)} isDisabled={isSortIsLoading}>
          {t('myBacklog.autosort.alphabeticalOrder')}
        </Button>
        <SortByDateButton status={STATUS} isDisabled={isSortIsLoading} />
      </Flex>
      <Flex flexDir="column" gap={2} mt={6}>
        <Box w="100%" overflowX="auto" position="relative" px="8px">
          {isSortIsLoading && (
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
            gridTemplateColumns={'90px 1fr 200px max-content'}
            rowGap="10px"
            alignItems="center"
          >
            {/* header */}
            <GridItem />
            <GridItem>{t('myBacklog.info')}</GridItem>
            <GridItem>{t('myBacklog.finishedAt')}</GridItem>
            <GridItem>{t('myBacklog.actions')}</GridItem>
            <GridItem colSpan={4}>
              <Divider my="6px" />
            </GridItem>
            {/* content */}
            {games.map((game, index) => {
              const firstRow = index === 0;
              const lastRow = index === games.length - 1;

              return (
                <Fragment key={game.id}>
                  <GridItem>
                    <ReorderControl
                      firstRow={firstRow}
                      lastRow={lastRow}
                      gameId={game.id}
                      status={STATUS}
                      onArrowClick={onArrowClick}
                      moveToPosition={moveToPosition}
                      index={index + 1}
                    />
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
                      {game.finishedAt
                        ? format(new Date(game.finishedAt), 'dd/MM/yyyy')
                        : null}
                    </Text>
                  </GridItem>
                  <GridItem>
                    <Flex gap={2} flexWrap="wrap">
                      <Button
                        colorScheme="orange"
                        leftIcon={<SettingsIcon />}
                        iconSpacing={{ base: 0, md: 2 }}
                        onClick={() => setChangeStatusBacklogItemId(game.id)}
                      >
                        <Show above="md">{t('myBacklog.changeStatus')}</Show>
                      </Button>
                      <Button
                        colorScheme="teal"
                        leftIcon={<EditIcon />}
                        iconSpacing={{ base: 0, md: 2 }}
                        onClick={() => setUpdateReviewBacklogItemId(game.id)}
                      >
                        <Show above="md">{t('myBacklog.review')}</Show>
                      </Button>
                    </Flex>
                  </GridItem>
                  <GridItem colSpan={4}>
                    <Divider my="12px" />
                  </GridItem>
                </Fragment>
              );
            })}
          </Grid>
        </Box>
      </Flex>
      <ChangeStateModal
        backlogItemId={changeStatusBacklogItemId}
        onClose={() => setChangeStatusBacklogItemId(null)}
        currentStatus={STATUS}
        values={[STATUS, 'BACKLOG']}
      />
      <ReviewModal
        backlogItemId={updateReviewBacklogItemId}
        onClose={() => setUpdateReviewBacklogItemId(null)}
      />
    </Flex>
  );
};
