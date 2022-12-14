import { Box, Divider, Flex } from '@chakra-ui/react';
import {
  getCardsToFusion,
  getCardsToGold,
  getGlobalRanking,
  getProfile,
  RankByUser,
} from '@discord-bot-v2/common';
import { prisma } from '@discord-bot-v2/prisma';
import { GetStaticProps, GetServerSideProps } from 'next';
import { GeneralInformation } from '../../../components/gacha/profile/general-informations';
import { InventoryList } from '../../../components/gacha/profile/inventory-list';
import { CardToGoldList } from '../../../components/gacha/profile/card-to-gold-list';
import { FusionList } from '../../../components/gacha/profile/fusion-list';
import {
  CardsToGoldType,
  CardWithFusionDependencies,
  ProfileType,
} from '../../../utils/types';

type GachaProfilePageProps = {
  cardsToGold: CardsToGoldType;
  profile: ProfileType;
  rank: RankByUser;
  fusions: CardWithFusionDependencies[];
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

export const getStaticProps: GetStaticProps<GachaProfilePageProps> = async (
  context
) => {
  const { params = {} } = context;
  const discordId = Array.isArray(params.discordId)
    ? params.discordId[0]
    : params.discordId || '';
  const profile = await getProfile(discordId);

  if (!profile) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }

  const cardsToGold = await getCardsToGold(discordId);
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
    },
  };
};

export function GachaProfilePage({
  profile,
  rank,
  cardsToGold,
  fusions,
}: GachaProfilePageProps) {
  return (
    <Box px="20px" pb="50px" pt="20px" color="gray.300">
      <GeneralInformation profile={profile} rank={rank} />
      <Divider my={2} borderBottomWidth="2px" />
      <Flex flexWrap="wrap" w="100%" justifyContent="center" gap={10} pt="20px">
        <InventoryList
          width={{ base: '100%', md: 'calc(50% - var(--chakra-space-10))' }}
          profile={profile}
        />
        <CardToGoldList
          width={{ base: '100%', md: 'calc(50% - var(--chakra-space-10))' }}
          cardsToGold={cardsToGold}
        />
        <FusionList
          width={{ base: '100%', md: 'calc(50% - var(--chakra-space-10))' }}
          fusionCards={fusions}
        />
      </Flex>
    </Box>
  );
}

export default GachaProfilePage;
