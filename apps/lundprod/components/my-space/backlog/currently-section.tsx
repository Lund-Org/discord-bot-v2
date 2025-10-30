import {
  ArrowDownIcon,
  ArrowUpIcon,
  DeleteIcon,
  EditIcon,
  ExternalLinkIcon,
  SettingsIcon,
} from '@chakra-ui/icons';
import {
  Box,
  Button,
  chakra,
  Divider,
  Flex,
  Grid,
  GridItem,
  IconButton,
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
import { BacklogItemMoveType } from '~/lundprod/server/types';

import { ChangeStateModal } from './change-state-modal';
import { NoteModal } from './note-modal';
import { ConfirmationModal } from '../../confirmation-modal';
import { useBacklogHooks } from '~/lundprod/hooks/my-space/use-backlog-hooks';
import { EmptyPlaceholder } from './empty-placeholder';

const STATUS: BacklogGame['status'] = 'CURRENTLY';

export const CurrentlySection = () => {
  const { t } = useTranslation();
  const { backlogByStatus } = useMe();

  const {
    changeStatusBacklogItemId,
    setChangeStatusBacklogItemId,
    updateNoteBacklogItemId,
    setUpdateNoteBacklogItemId,
    removeBacklogItemId,
    setRemoveBacklogItemId,
    onRemoveBacklogItem,
    sortByName,
    sortByDate,
    onArrowClick,
    isSortIsLoading,
    isRemoveBacklogItemLoading,
  } = useBacklogHooks();

  const games = useMemo(
    () => sortBy(backlogByStatus[STATUS] || [], 'order'),
    [backlogByStatus],
  );

  if (games.length === 0) {
    return (
      <EmptyPlaceholder
        title={t('myBacklog.placeholder.currently.title')}
        description={t('myBacklog.placeholder.currently.description')}
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
        <Button onClick={() => sortByDate(STATUS)} isDisabled={isSortIsLoading}>
          {t('myBacklog.autosort.byDateOrder')}
        </Button>
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
            gridTemplateColumns={'65px 1fr 200px max-content'}
            rowGap="10px"
            alignItems="center"
          >
            {/* header */}
            <GridItem />
            <GridItem>{t('myBacklog.info')}</GridItem>
            <GridItem>{t('myBacklog.startedAt')}</GridItem>
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
                    <Flex
                      h="100%"
                      flexDir="column"
                      justifyContent="center"
                      display="block"
                    >
                      <Box
                        color={firstRow ? 'gray.700' : 'gray.500'}
                        _hover={firstRow ? undefined : { color: 'gray.300' }}
                        mb={1}
                        onClick={
                          firstRow
                            ? undefined
                            : () =>
                                onArrowClick(
                                  game.id,
                                  BacklogItemMoveType.UP,
                                  STATUS,
                                )
                        }
                        cursor={firstRow ? 'not-allowed' : 'pointer'}
                        w="fit-content"
                      >
                        <ArrowUpIcon boxSize="24px" />
                      </Box>
                      <Box
                        color={lastRow ? 'gray.700' : 'gray.500'}
                        _hover={lastRow ? undefined : { color: 'gray.300' }}
                        mt={1}
                        onClick={
                          lastRow
                            ? undefined
                            : () =>
                                onArrowClick(
                                  game.id,
                                  BacklogItemMoveType.DOWN,
                                  STATUS,
                                )
                        }
                        cursor={lastRow ? 'not-allowed' : 'pointer'}
                        w="fit-content"
                      >
                        <ArrowDownIcon boxSize="24px" />
                      </Box>
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
                      {game.startedAt
                        ? format(new Date(game.startedAt), 'dd/MM/yyyy')
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
                        onClick={() => setUpdateNoteBacklogItemId(game.id)}
                      >
                        <Show above="md">{t('myBacklog.note')}</Show>
                      </Button>
                      <IconButton
                        onClick={() => setRemoveBacklogItemId(game.id)}
                        icon={<DeleteIcon />}
                        aria-label={t('myBacklog.delete')}
                      />
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
        values={[STATUS, 'BACKLOG', 'FINISHED', 'ABANDONED']}
      />
      <NoteModal
        backlogItemId={updateNoteBacklogItemId}
        onClose={() => setUpdateNoteBacklogItemId(null)}
      />
      <ConfirmationModal
        isOpen={!!removeBacklogItemId}
        onClose={() => setRemoveBacklogItemId(null)}
        onConfirm={onRemoveBacklogItem}
        isLoading={isRemoveBacklogItemLoading}
      />
    </Flex>
  );
};
