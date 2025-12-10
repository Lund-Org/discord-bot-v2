import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Show,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { Game, gameTypeMapping } from '@discord-bot-v2/igdb-front';
import { prisma } from '@discord-bot-v2/prisma';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AbandonedSection } from '~/lundprod/components/my-space/backlog/abandoned-section';
import { CurrentlySection } from '~/lundprod/components/my-space/backlog/currently-section';
import { FinishedSection } from '~/lundprod/components/my-space/backlog/finished-section';
import { TodoSection } from '~/lundprod/components/my-space/backlog/todo-section';
import { WishlistSection } from '~/lundprod/components/my-space/backlog/wishlist-section';
import { SearchGameModal } from '~/lundprod/components/search-game-modal/search-game-modal';
import { BacklogGame, useMe } from '~/lundprod/contexts/me.context';
import { useErrorToast, useSuccessToast } from '~/lundprod/hooks/use-toast';
import { MyPagesLayout } from '~/lundprod/layouts/MyPagesLayout';
import { trpc } from '~/lundprod/utils/trpc';

import { authOptions } from '../api/auth/[...nextauth]';

type PropsType = object;

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

export function BacklogWrapper() {
  const { t } = useTranslation();
  const { backlog } = useMe();
  const queryClient = trpc.useUtils();
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();

  const [isSearchingGame, setIsSearchingGame] = useState(false);

  const { mutateAsync: addBacklogItem, isPending: isAddBacklogItemPending } =
    trpc.addBacklogItem.useMutation();
  const {
    mutateAsync: removeBacklogItem,
    isPending: isRemoveBacklogItemPending,
  } = trpc.removeBacklogItem.useMutation();

  const isPending = isAddBacklogItemPending || isRemoveBacklogItemPending;

  const onAddGame = async (game: Game) => {
    try {
      const { backlogItem } = await addBacklogItem({
        gameId: game.id,
        game_type: gameTypeMapping[game.game_type] || '',
        name: game.name,
        url: game.url,
      });

      queryClient.getMyBacklog.setData(
        {},
        (data: BacklogGame[] | undefined) => {
          return data ? [...data, backlogItem] : [backlogItem];
        },
      );

      successToast({
        title: t('myBacklog.addGameSuccessTitle'),
      });
    } catch (err) {
      errorToast({
        title: t('myBacklog.addGameErrorTitle'),
        description: t('myBacklog.addGameErrorDescription'),
      });
    }
  };
  const onRemoveGame = async (game: Game) => {
    const item = backlog.find(({ igdbGameId }) => game.id === igdbGameId);

    if (!item) {
      return;
    }

    try {
      await removeBacklogItem({
        itemId: item.id,
      });

      queryClient.getMyBacklog.setData(
        {},
        (data: BacklogGame[] | undefined) => {
          return (data || []).filter(({ id }) => item.id !== id);
        },
      );

      successToast({
        title: t('myBacklog.removeGameSuccessTitle'),
      });
    } catch (err) {
      errorToast({
        title: t('myBacklog.removeGameErrorTitle'),
        description: t('myBacklog.removeGameErrorDescription'),
      });
    }
  };

  return (
    <MyPagesLayout
      title={t('myBacklog.title')}
      actions={
        <Button
          colorScheme="orange"
          leftIcon={<AddIcon />}
          isLoading={isPending}
          onClick={() => setIsSearchingGame(true)}
        >
          <Show above="md">{t('myBacklog.addGame')}</Show>
        </Button>
      }
    >
      <Tabs variant="unstyled" isFitted colorScheme="teal" position="relative">
        <TabList>
          <Tab>{t('myBacklog.tabs.backlog')}</Tab>
          <Tab>{t('myBacklog.tabs.currently')}</Tab>
          <Tab>{t('myBacklog.tabs.finished')}</Tab>
          <Tab>{t('myBacklog.tabs.abandoned')}</Tab>
          <Tab>{t('myBacklog.tabs.wishlist')}</Tab>
        </TabList>
        <TabIndicator mt="-2px" height="3px" bg="teal.400" borderRadius="1px" />
        <Box h="1px" bg="teal.200" opacity={0.5} />
        <TabPanels pt="20px">
          <TabPanel>
            <TodoSection openAddGameModal={() => setIsSearchingGame(true)} />
          </TabPanel>
          <TabPanel>
            <CurrentlySection />
          </TabPanel>
          <TabPanel>
            <FinishedSection />
          </TabPanel>
          <TabPanel>
            <AbandonedSection />
          </TabPanel>
          <TabPanel>
            <WishlistSection />
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/*  */}
      <SearchGameModal
        isOpen={isSearchingGame}
        onClose={() => setIsSearchingGame(false)}
        onGameSelected={onAddGame}
        onGameUnselected={onRemoveGame}
        futureGame={false}
        isGameSelected={(game: Game) =>
          !!backlog.find(({ igdbGameId }) => game.id === igdbGameId)
        }
        isLoading={isPending}
      />
    </MyPagesLayout>
  );
}

export default BacklogWrapper;
