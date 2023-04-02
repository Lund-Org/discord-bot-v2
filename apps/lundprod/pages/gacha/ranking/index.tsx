import { Box } from '@chakra-ui/react';
import { getGlobalRanking, RankByUser } from '@discord-bot-v2/common';
import { GetStaticProps } from 'next';

import { Rank } from '~/lundprod/components/gacha/ranking/rank';
import { RankList } from '~/lundprod/components/gacha/ranking/rank-list';

type GachaRankPageProps = {
  ranks: RankByUser[];
};

export const getStaticProps: GetStaticProps<GachaRankPageProps> = async () => {
  const ranks = await getGlobalRanking();

  return {
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every hour
    revalidate: 3600, // In seconds
    // Passed to the page component as props
    props: { ranks: JSON.parse(JSON.stringify(ranks)) },
  };
};

export function GachaRankPage({ ranks }: GachaRankPageProps) {
  const [top1, top2, top3, ...others] = ranks;

  return (
    <Box
      padding={{ base: 0, md: '20px' }}
      display={{ base: 'block', md: 'flex' }}
    >
      <Box width={{ base: '100%', md: '50%' }}>
        {top1 ? <Rank rank={top1} level={1} /> : null}
        {top2 ? <Rank rank={top2} level={2} /> : null}
        {top3 ? <Rank rank={top3} level={3} /> : null}
      </Box>
      <Box
        width={{ base: '100%', md: '50%' }}
        fontSize={{ base: 'inherit', md: '16px' }}
      >
        <RankList ranks={others} />
      </Box>
    </Box>
  );
}

export default GachaRankPage;
