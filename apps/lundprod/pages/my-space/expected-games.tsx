import {
  Box,
  Button,
  chakra,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Show,
  Switch,
  Tag,
  Text,
} from '@chakra-ui/react';
import { AddIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Game,
  gameTypeMapping,
  getPlatformLabel,
  platForms,
  translateRegion,
} from '@discord-bot-v2/igdb-front';
import { prisma } from '@discord-bot-v2/prisma';
import { format } from 'date-fns';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { trpc } from '~/lundprod/utils/trpc';
import { useMe } from '~/lundprod/contexts/me.context';
import { MyPagesLayout } from '~/lundprod/layouts/MyPagesLayout';
import { SearchGameModal } from '~/lundprod/components/search-game-modal/search-game-modal';
import { useErrorToast, useSuccessToast } from '~/lundprod/hooks/use-toast';
import { EmptyPlaceholder } from '~/lundprod/components/my-space/backlog/empty-placeholder';

import { authOptions } from '../api/auth/[...nextauth]';

type PropsType = {};

export const getServerSideProps: GetServerSideProps<PropsType> = async ({
  req,
  res,
}) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const user = await prisma.user.findFirst({
    where: {
      discordId: session.userId,
      isActive: true,
    },
  });

  if (!user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};

export function ExpectedGameWrapper({}: PropsType) {
  const { t } = useTranslation();
  const { expectedGames, isLoading } = useMe();
  const queryClient = trpc.useUtils();
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();

  const [isSearchingGame, setIsSearchingGame] = useState(false);

  const { mutateAsync: addExpectedGame, isPending: isAddGamePending } =
    trpc.addExpectedGame.useMutation();
  const { mutate: toggleExpectedGameBacklog } =
    trpc.toggleExpectedGameBacklog.useMutation();
  const { mutateAsync: removeExpectedGame, isPending: isRemoveGamePending } =
    trpc.removeExpectedGame.useMutation();

  if (isLoading) {
    return null;
  }

  const onAddGame = async (game: Game, platformId?: number) => {
    const region = (game.release_dates || []).find(
      ({ platform }) => platform.id === platformId,
    )?.release_region;

    // not possible
    if (!platformId || !region) {
      return;
    }

    try {
      const { expectedGame } = await addExpectedGame({
        gameId: game.id,
        game_type: gameTypeMapping[game.game_type] || '',
        name: game.name,
        url: game.url,
        addToBacklog: false,
        platformId,
        region,
      });

      queryClient.getMyExpectedGames.setData({}, (data) => {
        return data ? [...data, expectedGame] : [expectedGame];
      });

      successToast({
        title: t('myExpectedGame.addExpectedGameSuccessTitle'),
      });
    } catch (err) {
      errorToast({
        title: t('myExpectedGame.addExpectedGameErrorTitle'),
        description: t('myExpectedGame.addExpectedGameErrorDescription'),
      });
    }
  };

  const toggleAddToBacklog = (itemId: number) => {
    const toggleCacheData = () =>
      queryClient.getMyExpectedGames.setData({}, (data) => {
        if (!data) {
          return [];
        }

        const newData = [...data];
        const index = newData.findIndex(({ id }) => id === itemId);

        if (index === -1) {
          return data;
        }

        newData[index].addToBacklog = !newData[index].addToBacklog;

        return newData;
      });

    toggleExpectedGameBacklog(
      { id: itemId },
      {
        onError: () => {
          toggleCacheData();
          errorToast({
            title: t('myExpectedGame.toggleAddBacklogErrorTitle'),
            description: t('myExpectedGame.toggleAddBacklogErrorDescription'),
          });
        },
      },
    );

    toggleCacheData();
  };

  const onRemoveExpectedGame = async (itemId: number) => {
    try {
      await removeExpectedGame({ id: itemId });

      queryClient.getMyExpectedGames.setData({}, (data) => {
        return (data || []).filter(({ id }) => id !== itemId);
      });

      successToast({
        title: t('myExpectedGame.removeExpectedGameSuccessTitle'),
      });
    } catch (err) {
      errorToast({
        title: t('myExpectedGame.removeExpectedGameErrorTitle'),
        description: t('myExpectedGame.removeExpectedGameErrorDescription'),
      });
    }
  };

  const isLoadingQueries = isAddGamePending || isRemoveGamePending;

  return (
    <MyPagesLayout
      title={t('myExpectedGame.title')}
      actions={
        <Button
          colorScheme="orange"
          leftIcon={<AddIcon />}
          isLoading={isAddGamePending}
          onClick={() => setIsSearchingGame(true)}
        >
          <Show above="md">{t('myExpectedGame.addGame')}</Show>
        </Button>
      }
    >
      {expectedGames.length === 0 ? (
        <EmptyPlaceholder
          title={t('myExpectedGame.placeholder.title')}
          description={t('myExpectedGame.placeholder.description')}
        >
          <Button onClick={() => setIsSearchingGame(true)} colorScheme="teal">
            {t('myExpectedGame.placeholder.button')}
          </Button>
        </EmptyPlaceholder>
      ) : (
        <Box w="100%" overflowX="auto" position="relative" px="8px">
          <Grid
            minW="600px"
            gridTemplateColumns={'1fr 200px max-content'}
            rowGap="10px"
            alignItems="center"
          >
            {/* header */}
            <GridItem>{t('myExpectedGame.info')}</GridItem>
            <GridItem>{t('myExpectedGame.expectedDate')}</GridItem>
            <GridItem>{t('myExpectedGame.actions')}</GridItem>
            <GridItem colSpan={3}>
              <Divider my="6px" />
            </GridItem>
            {/* content */}
            {expectedGames.map((game) => {
              const platform = getPlatformLabel(game.releaseDate?.platformId);

              return (
                <Fragment key={game.id}>
                  <GridItem>
                    <Flex alignItems="center" gap={2} flexWrap="wrap">
                      <Text>{game.name}</Text>
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
                    <Flex flexDir="column" gap={2} alignItems="flex-start">
                      {game.cancelled ? (
                        <Tag variant="outline" size="md" colorScheme="red">
                          {t('myExpectedGame.cancelled')}
                        </Tag>
                      ) : game.releaseDate?.date ? (
                        <>
                          <Tag variant="outline" size="md" colorScheme="teal">
                            {translateRegion(t, game.releaseDate.region)}
                          </Tag>
                          <Text fontSize={14} fontWeight={600}>
                            {format(
                              new Date(game.releaseDate.date),
                              'dd/MM/yyyy',
                            )}
                          </Text>
                        </>
                      ) : (
                        <Tag
                          variant="outline"
                          size="md"
                          colorScheme="whiteAlpha"
                        >
                          {t('myExpectedGame.unknown')}
                        </Tag>
                      )}
                      {!!platform && <Text>{platform}</Text>}
                    </Flex>
                  </GridItem>
                  <GridItem>
                    <Flex
                      gap={2}
                      flexDir="column"
                      justifyContent="center"
                      alignItems="flex-start"
                    >
                      <FormControl display="flex" alignItems="center" gap={2}>
                        <Switch
                          id={`add-to-backlog-${game.id}`}
                          sx={{
                            '.chakra-switch__track': {
                              bg: 'blue.800',
                            },
                            'input:checked + .chakra-switch__track': {
                              bg: 'orange.400',
                            },
                          }}
                          size="lg"
                          onChange={() => toggleAddToBacklog(game.id)}
                          isDisabled={isLoadingQueries}
                          isChecked={game.addToBacklog}
                        />
                        <FormLabel htmlFor={`add-to-backlog-${game.id}`} m={0}>
                          {t('myExpectedGame.addToBacklog')}
                        </FormLabel>
                      </FormControl>
                      <Button
                        colorScheme="red"
                        onClick={() => onRemoveExpectedGame(game.id)}
                        isLoading={isRemoveGamePending}
                      >
                        {t('myExpectedGame.delete')}
                      </Button>
                    </Flex>
                  </GridItem>
                  <GridItem colSpan={3}>
                    <Divider my="12px" />
                  </GridItem>
                </Fragment>
              );
            })}
          </Grid>
        </Box>
      )}

      {/*  */}
      <SearchGameModal
        isOpen={isSearchingGame}
        onClose={() => setIsSearchingGame(false)}
        onGameSelected={onAddGame}
        futureGame
        selectByPlatform
        isGameSelected={(game: Game, platformId) =>
          !!expectedGames.find(
            ({ igdbId, releaseDate }) =>
              game.id === igdbId && releaseDate?.platformId === platformId,
          )
        }
        isLoading={isAddGamePending || isRemoveGamePending}
        onGameUnselected={(game) => {
          const item = expectedGames.find(({ igdbId }) => game.id === igdbId);

          if (item) {
            onRemoveExpectedGame(item.id);
          }
        }}
      />
    </MyPagesLayout>
  );
}

export default ExpectedGameWrapper;
