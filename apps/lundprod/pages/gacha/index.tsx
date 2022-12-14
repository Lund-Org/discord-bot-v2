import { Flex, useBreakpointValue } from '@chakra-ui/react';
import { prisma } from '@discord-bot-v2/prisma';
import { CardWithFusionDependencies } from '../../utils/types';
import { CardPreviewContainer } from '../../components/gacha/home/card-preview-container';
import { Navbar } from '../../components/gacha/home/navbar';
import { GachaHomeProvider } from '../../contexts/gacha-home-context';
import { GetStaticProps } from 'next';

type GachaPageProps = {
  cardTypes: CardWithFusionDependencies[];
};

export const getStaticProps: GetStaticProps<GachaPageProps> = async () => {
  const cardTypes = await prisma.cardType.findMany({
    include: {
      fusionDependencies: true,
    },
  });

  return {
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every hour
    revalidate: 3600, // In seconds
    // Passed to the page component as props
    props: { cardTypes },
  };
};

export function GachaPage({ cardTypes }: GachaPageProps) {
  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });

  return (
    <GachaHomeProvider cards={cardTypes}>
      <Flex maxH="100vh">
        <Navbar />
        {!isMobile && <CardPreviewContainer />}
      </Flex>
    </GachaHomeProvider>
  );
}

export default GachaPage;
