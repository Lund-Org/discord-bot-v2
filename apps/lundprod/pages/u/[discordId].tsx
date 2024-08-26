import {
  Box,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import {
  getCardsToFusion,
  getGlobalRanking,
  RankByUser,
} from '@discord-bot-v2/common';
import { prisma } from '@discord-bot-v2/prisma';
import { GetStaticProps } from 'next';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { BacklogList } from '~/lundprod/components/my-space/backlog/backlog-list';
import { ExpectedGamesListView } from '~/lundprod/components/my-space/expected-games/expected-games-list-view';
import { GachaTab } from '~/lundprod/components/profile/gacha-tab';
import { GeneralInformation } from '~/lundprod/components/profile/general-informations';
import {
  BacklogItemLight,
  BacklogProvider,
} from '~/lundprod/contexts/backlog-context';
import { ExpectedGameProvider } from '~/lundprod/contexts/expected-games-context';
import { useFetcher } from '~/lundprod/hooks/useFetcher';
import { ExpectedGame } from '~/lundprod/utils/api/expected-games';
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
  context,
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
  const [isLoadingBacklog, setIsLoadingBacklog] = useState(true);
  const [isLoadingExpectedGames, setIsLoadingExpectedGames] = useState(true);
  const [initialBacklog, setInitialBacklog] = useState<BacklogItemLight[]>([]);
  const [expectedGames, setExpectedGames] = useState<ExpectedGame[]>([]);
  const selected = {
    color: 'orange.400',
    borderBottomColor: 'orange.400',
  };
  const { get } = useFetcher();

  useEffect(() => {
    get(`/api/backlog/list/${profile.discordId}`)
      .then((response) => {
        setInitialBacklog(response.backlogItems);
      })
      .catch((err) => {
        console.error(err);
        setInitialBacklog([]);
      })
      .finally(() => setIsLoadingBacklog(false));
    get(`/api/expected-games/list/${profile.discordId}`)
      .then((response) => {
        setExpectedGames(response.expectedGames);
      })
      .catch((err) => {
        console.error(err);
        setExpectedGames([]);
      })
      .finally(() => setIsLoadingExpectedGames(false));
  }, [get, profile]);

  const loader = (
    <Spinner
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="orange.400"
      size="xl"
    />
  );

  return (
    <Box px="20px" pb="50px" pt="20px" color="gray.300">
      <GeneralInformation profile={profile} rank={rank} />
      <Tabs mt={6} defaultIndex={profile.player ? 0 : 1}>
        <TabList>
          <Tab _selected={selected} _active={{}} isDisabled={!profile.player}>
            {t('userPage.gacha')}
          </Tab>
          <Tab _selected={selected} _active={{}}>
            {t('userPage.backlog')}
          </Tab>
          <Tab _selected={selected} _active={{}}>
            {t('userPage.expectedGames')}
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
            {isLoadingBacklog ? (
              loader
            ) : (
              <BacklogProvider backlog={initialBacklog}>
                <BacklogList userName={profile.username} isReadOnly />
              </BacklogProvider>
            )}
          </TabPanel>
          <TabPanel>
            {isLoadingExpectedGames ? (
              loader
            ) : (
              <ExpectedGameProvider expectedGames={expectedGames}>
                <ExpectedGamesListView readOnly />
              </ExpectedGameProvider>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default UserProfilePage;
