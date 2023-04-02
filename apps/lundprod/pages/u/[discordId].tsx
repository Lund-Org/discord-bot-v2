import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import {
  getCardsToFusion,
  getGlobalRanking,
  RankByUser,
} from '@discord-bot-v2/common';
import { prisma } from '@discord-bot-v2/prisma';
import { GetStaticProps } from 'next';

import { BacklogList } from '~/lundprod/components/my-space/backlog/backlog-list';
import { GachaTab } from '~/lundprod/components/profile/gacha-tab';
import { GeneralInformation } from '~/lundprod/components/profile/general-informations';
import {
  BacklogItemLight,
  BacklogProvider,
} from '~/lundprod/contexts/backlog-context';
import { getParam } from '~/lundprod/utils/next';
import {
  CardsToGoldType,
  CardWithFusionDependencies,
  ProfileType,
} from '~/lundprod/utils/types';

type UserProfilePageProps = {
  cardsToGold: CardsToGoldType;
  profile: ProfileType;
  rank: RankByUser | null;
  fusions: CardWithFusionDependencies[];
  backlogItems: BacklogItemLight[];
};

export async function getStaticPaths() {
  const users = await prisma.user.findMany({
    include: {
      player: true,
    },
    where: { isActive: true },
  });

  const paths = users
    .filter(({ player }) => player)
    .map((user) => ({
      params: { discordId: user.discordId },
    }));

  return { paths, fallback: 'blocking' };
}

export const getStaticProps: GetStaticProps<UserProfilePageProps> = async (
  context
) => {
  const { params = {} } = context;
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

  const backlogItems = await prisma.backlogItem.findMany({
    where: { userId: profile.id },
    select: {
      igdbGameId: true,
      name: true,
      category: true,
      url: true,
      status: true,
      reason: true,
      rating: true,
      order: true,
    },
    orderBy: { order: 'asc' },
  });
  const cardsToGold = await prisma.playerInventory.getCardsToGold(discordId);
  const [rank] = profile.player
    ? await getGlobalRanking([profile.player.id])
    : [null];
  const fusions = await getCardsToFusion(discordId);

  return {
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every hour
    revalidate: 3600, // In seconds
    // Passed to the page component as props
    props: {
      profile: JSON.parse(JSON.stringify(profile)),
      cardsToGold,
      rank: rank ? JSON.parse(JSON.stringify(rank)) : null,
      fusions,
      backlogItems,
    },
  };
};

export function UserProfilePage({
  profile,
  rank,
  cardsToGold,
  fusions,
  backlogItems,
}: UserProfilePageProps) {
  const selected = {
    color: 'orange.400',
    borderBottomColor: 'orange.400',
  };

  return (
    <Box px="20px" pb="50px" pt="20px" color="gray.300">
      <GeneralInformation profile={profile} rank={rank} />
      <Tabs mt={6} defaultIndex={profile.player ? 0 : 1}>
        <TabList>
          <Tab _selected={selected} _active={{}} isDisabled={!profile.player}>
            Gacha
          </Tab>
          <Tab _selected={selected} _active={{}}>
            Backlog
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <GachaTab
              profile={profile}
              cardsToGold={cardsToGold}
              fusions={fusions}
            />
          </TabPanel>
          <TabPanel>
            <BacklogProvider backlog={backlogItems}>
              <BacklogList />
            </BacklogProvider>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default UserProfilePage;
