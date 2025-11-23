import {
  Box,
  Flex,
  Heading,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { createServerSideHelpers } from '@trpc/react-query/server';
import {
  getCardsToFusion,
  getGlobalRanking,
  RankByUser,
} from '@discord-bot-v2/common';
import { prisma } from '@discord-bot-v2/prisma';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { GeneralInformation } from '~/lundprod/components/profile/general-informations';
import { useFetcher } from '~/lundprod/hooks/useFetcher';
import { appRouter, AppRouter, createContext } from '~/lundprod/server/trpc';
import { getParam } from '~/lundprod/utils/next';
import {
  CardsToGoldType,
  CardWithFusionDependencies,
  ProfileType,
} from '~/lundprod/utils/types';
import { authOptions } from '../api/auth/[...nextauth]';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { BacklogView } from '~/lundprod/components/profile/backlog-view';
import { ExpectedGamesView } from '~/lundprod/components/profile/expected-games-view';
import { QueryTabs } from '~/lundprod/components/tabs';

type UserProfilePageProps = {
  // cardsToGold: CardsToGoldType;
  profile: ProfileType;
  // rank: RankByUser | null;
  // fusions: CardWithFusionDependencies[];
};

enum TABS {
  BACKLOG = 'backlog',
  EXPECTED_GAMES = 'expected-games',
  GACHA = 'gacha',
}

export const getServerSideProps: GetServerSideProps<
  UserProfilePageProps
> = async ({ req, res, params = {} }) => {
  const session = await getServerSession(req, res, authOptions);
  const discordId = getParam(params.discordId, '');
  const profile = await prisma.user.getProfile(discordId);

  if (!profile) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }

  // const cardsToGold = await prisma.playerInventory.getCardsToGold(discordId);
  // const [rank] = profile.player
  //   ? await getGlobalRanking([profile.player.id])
  //   : [null];
  // const fusions = await getCardsToFusion(discordId);

  const helpers = createServerSideHelpers<AppRouter>({
    router: appRouter,
    ctx: await createContext({ session }),
  });

  const queryClient = new QueryClient();

  const page = parseInt(getParam(params.page, '1'), 10);
  const status = getParam(params.status, '');
  const tab = getParam(params.tab, 'expected-games');

  await Promise.all([
    helpers.getBacklog.prefetch({
      discordId,
      category: 'ABANDONED',
      page: status === 'ABANDONED' ? page : 1,
    }),
    helpers.getBacklog.prefetch({
      discordId,
      category: 'BACKLOG',
      page: status === 'BACKLOG' ? page : 1,
    }),
    helpers.getBacklog.prefetch({
      discordId,
      category: 'CURRENTLY',
      page: status === 'CURRENTLY' ? page : 1,
    }),
    helpers.getBacklog.prefetch({
      discordId,
      category: 'FINISHED',
      page: status === 'FINISHED' ? page : 1,
    }),
    helpers.getBacklog.prefetch({
      discordId,
      category: 'WISHLIST',
      page: status === 'WISHLIST' ? page : 1,
    }),
    helpers.getExpectedGames.prefetch({
      discordId,
      page: tab === TABS.EXPECTED_GAMES ? page : 1,
    }),
  ]);

  return {
    // Passed to the page component as props
    props: {
      profile: JSON.parse(JSON.stringify(profile)),
      // cardsToGold: JSON.parse(JSON.stringify(cardsToGold)),
      // rank: rank ? JSON.parse(JSON.stringify(rank)) : null,
      // fusions: JSON.parse(JSON.stringify(fusions)),
      trpcState: helpers.dehydrate(),
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export function UserProfilePage({
  profile,
  // rank,
  // cardsToGold,
  // fusions,
}: UserProfilePageProps) {
  const { t } = useTranslation();
  const { query, replace } = useRouter();

  useEffect(() => {
    if (query.igdbGameId) {
      const url = new URL(document.location.href);

      url.searchParams.set('tab', TABS.BACKLOG);

      replace(url);
    }
  }, [query.igdbGameId]);

  return (
    <Box px="20px" pb="50px" pt="20px" color="gray.300">
      <GeneralInformation profile={profile} rank={null /*rank*/} />
      <QueryTabs
        queryName={'tab'}
        values={Object.values(TABS)}
        tabs={{
          [TABS.BACKLOG]: t('userPage.backlog'),
          [TABS.EXPECTED_GAMES]: t('userPage.expectedGames'),
          [TABS.GACHA]: t('userPage.gacha'),
        }}
        defaultValue={TABS.BACKLOG}
        tabsProps={{ mt: 6 }}
        tabProps={(value, isSelected) => ({
          ...(value === TABS.GACHA
            ? {
                isDisabled: !profile.player,
              }
            : {}),
          _selected: {
            color: 'orange.400',
            borderBottomColor: 'orange.400',
          },
          _active: {},
        })}
      >
        <TabPanels>
          <TabPanel>
            <BacklogView
              username={profile.username}
              discordId={profile.discordId}
            />
          </TabPanel>
          <TabPanel>
            <ExpectedGamesView />
          </TabPanel>
          <TabPanel>
            <Flex
              alignItems="center"
              justifyContent="center"
              minW="500px"
              minH="500px"
              mx="auto"
            >
              <Heading variant="h3">{t('userPage.underRework')}</Heading>
            </Flex>
            {/* <GachaTab
              profile={profile}
              cardsToGold={cardsToGold}
              fusions={fusions}
            /> */}
          </TabPanel>
        </TabPanels>
      </QueryTabs>
    </Box>
  );
}

export default UserProfilePage;
