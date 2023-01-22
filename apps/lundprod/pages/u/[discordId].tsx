import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import {
  getCardsToFusion,
  getGlobalRanking,
  RankByUser,
} from '@discord-bot-v2/common';
import { prisma } from '@discord-bot-v2/prisma';
import { GetStaticProps } from 'next';
import { GeneralInformation } from '~/lundprod/components/profile/general-informations';
import {
  CardsToGoldType,
  CardWithFusionDependencies,
  ProfileType,
} from '~/lundprod/utils/types';
import { GachaTab } from '~/lundprod/components/profile/gacha-tab';
import {
  BacklogItemLight,
  BacklogProvider,
} from '~/lundprod/contexts/backlog-context';
import { BacklogList } from '~/lundprod/components/my-space/backlog/backlog-list';

type UserProfilePageProps = {
  cardsToGold: CardsToGoldType;
  profile: ProfileType;
  rank: RankByUser;
  fusions: CardWithFusionDependencies[];
  backlogItems: BacklogItemLight[];
};

export async function getStaticPaths() {
  const players = await prisma.player.findMany({
    select: { discordId: true },
  });

  const paths = players.map((player) => ({
    params: { discordId: player.discordId },
  }));

  return { paths, fallback: 'blocking' };
}

export const getStaticProps: GetStaticProps<UserProfilePageProps> = async (
  context
) => {
  const { params = {} } = context;
  const discordId = Array.isArray(params.discordId)
    ? params.discordId[0]
    : params.discordId || '';
  const profile = await prisma.player.getProfile(discordId);

  if (!profile) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }

  const backlogItems = await prisma.backlogItem.findMany({
    where: { playerId: profile.id },
    select: {
      igdbGameId: true,
      name: true,
      category: true,
      url: true,
      status: true,
      reason: true,
      rating: true,
    },
  });
  const cardsToGold = await prisma.playerInventory.getCardsToGold(discordId);
  const [rank] = await getGlobalRanking([profile.id]);
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
      rank: JSON.parse(JSON.stringify(rank)),
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
      <Tabs mt={6}>
        <TabList>
          <Tab _selected={selected} _active={{}}>
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
