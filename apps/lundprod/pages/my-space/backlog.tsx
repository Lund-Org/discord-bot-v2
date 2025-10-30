import {
  Box,
  Button,
  Flex,
  Heading,
  Hide,
  Show,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { prisma } from '@discord-bot-v2/prisma';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '../api/auth/[...nextauth]';
import { useTranslation } from 'react-i18next';
import { convertPrismaToBacklogItem } from '~/lundprod/utils/backlog';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { trpc } from '~/lundprod/utils/trpc';
import { BacklogGame, useMe } from '~/lundprod/contexts/me.context';

import { createServerSideHelpers } from '@trpc/react-query/server';
import { AppRouter, appRouter, createContext } from '../../server/trpc';
import { MyPagesLayout } from '~/lundprod/layouts/MyPagesLayout';
import { AddIcon } from '@chakra-ui/icons';
import { TodoSection } from '~/lundprod/components/my-space/backlog/todo-section';
import { SearchGameModal } from '~/lundprod/components/search-game-modal/search-game-modal';
import { Game, gameTypeMapping } from '@discord-bot-v2/igdb-front';
import { useState } from 'react';
import { CurrentlySection } from '~/lundprod/components/my-space/backlog/currently-section';
import { WishlistSection } from '~/lundprod/components/my-space/backlog/wishlist-section';
import { FinishedSection } from '~/lundprod/components/my-space/backlog/finished-section';
import { AbandonedSection } from '~/lundprod/components/my-space/backlog/abandoned-section';
import { useErrorToast, useSuccessToast } from '~/lundprod/hooks/use-toast';

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

  // FOR SSR - not needed here but kept for later

  // const helpers = createServerSideHelpers<AppRouter>({
  //   router: appRouter,
  //   ctx: await createContext({ session }),
  // });

  // const queryClient = new QueryClient();

  // await helpers.getMyBacklog.prefetch({});
  // await helpers.getMyExpectedGames.prefetch({});

  return {
    props: {
      // trpcState: helpers.dehydrate(),
      // dehydratedState: dehydrate(queryClient),
      session,
    },
  };
};

export function BacklogWrapper({}: PropsType) {
  const { t } = useTranslation();
  const { backlog } = useMe();
  const queryClient = trpc.useUtils();
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();

  const [isSearchingGame, setIsSearchingGame] = useState(false);

  const { mutateAsync: addBacklogItem, isPending } =
    trpc.addBacklogItem.useMutation();

  const onAddGame = async (game: Game) => {
    setIsSearchingGame(false);

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
        futureGame={false}
        isGameSelected={(game: Game) =>
          !!backlog.find(({ igdbGameId }) => game.id === igdbGameId)
        }
      />
    </MyPagesLayout>
  );
}

export default BacklogWrapper;
