import { Box, TabPanel, TabPanels } from '@chakra-ui/react';
import {
  getCardsToFusion,
  getGlobalRanking,
  RankByUser,
} from '@discord-bot-v2/common';
import { prisma } from '@discord-bot-v2/prisma';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getServerSession } from 'next-auth/next';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { BacklogView } from '~/lundprod/components/profile/backlog-view';
import { ExpectedGamesView } from '~/lundprod/components/profile/expected-games-view';
import { GachaView } from '~/lundprod/components/profile/gacha-view';
import { GeneralInformation } from '~/lundprod/components/profile/general-informations';
import { QueryTabs } from '~/lundprod/components/tabs';
import { PROFILE_TABS } from '~/lundprod/constants/profile';
import { AppRouter, appRouter, createContext } from '~/lundprod/server/trpc';
import { getParam } from '~/lundprod/utils/next';
import {
  CardsToGoldType,
  CardWithFusionDependencies,
  ProfileType,
} from '~/lundprod/utils/types';

import { authOptions } from '../api/auth/[...nextauth]';

type UserProfilePageProps = {
  cardsToGold: CardsToGoldType;
  profile: ProfileType;
  rank: RankByUser | null;
  fusions: CardWithFusionDependencies[];
};

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

  const cardsToGold = await prisma.playerInventory.getCardsToGold(discordId);
  const [rank] = profile.player
    ? await getGlobalRanking([profile.player.id])
    : [null];
  const fusions = await getCardsToFusion(discordId);

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
      page: tab === PROFILE_TABS.EXPECTED_GAMES ? page : 1,
    }),
  ]);

  return {
    // Passed to the page component as props
    props: {
      profile: JSON.parse(JSON.stringify(profile)),
      cardsToGold: JSON.parse(JSON.stringify(cardsToGold)),
      rank: rank ? JSON.parse(JSON.stringify(rank)) : null,
      fusions: JSON.parse(JSON.stringify(fusions)),
      trpcState: helpers.dehydrate(),
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export function UserProfilePage({
  profile,
  rank,
  cardsToGold,
  fusions,
}: UserProfilePageProps) {
  const { t } = useTranslation();
  const { query, replace } = useRouter();

  useEffect(() => {
    if (query.igdbGameId) {
      const url = new URL(document.location.href);

      url.searchParams.set('tab', PROFILE_TABS.BACKLOG);

      replace(url);
    }
  }, [query.igdbGameId, replace]);

  return (
    <Box px="20px" pb="50px" pt="20px" maxW="1600px" mx="auto" color="gray.300">
      <GeneralInformation profile={profile} />
      <QueryTabs
        queryName={'tab'}
        values={Object.values(PROFILE_TABS)}
        tabs={{
          [PROFILE_TABS.BACKLOG]: t('userPage.backlog'),
          [PROFILE_TABS.EXPECTED_GAMES]: t('userPage.expectedGames'),
          [PROFILE_TABS.GACHA]: t('userPage.gacha'),
        }}
        defaultValue={PROFILE_TABS.BACKLOG}
        tabsProps={{ mt: 6 }}
        tabProps={(value) => ({
          ...(value === PROFILE_TABS.GACHA
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
            <GachaView
              profile={profile}
              cardsToGold={cardsToGold}
              fusions={fusions}
              rank={rank}
            />
          </TabPanel>
        </TabPanels>
      </QueryTabs>
    </Box>
  );
}

export default UserProfilePage;
