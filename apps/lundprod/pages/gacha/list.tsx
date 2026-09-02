import { Flex, useBreakpointValue } from '@chakra-ui/react';
import { prisma } from '@discord-bot-v2/prisma';
import { GetServerSideProps } from 'next';

import { CardPreviewContainer } from '~/lundprod/components/gacha/list/card-preview-container';
import { Navbar } from '~/lundprod/components/gacha/list/navbar';
import { Warning } from '~/lundprod/components/gacha/warning';
import { GachaHomeProvider } from '~/lundprod/contexts/gacha-home-context';
import { CardWithFusionDependencies } from '~/lundprod/utils/types';

type GachaPageListProps = {
  cardTypes: CardWithFusionDependencies[];
};

export const getServerSideProps: GetServerSideProps<
  GachaPageListProps
> = async () => {
  const cardTypes = await prisma.cardType.findMany({
    omit: {
      createdAt: true,
      updatedAt: true,
    },
    include: {
      fusionDependencies: {
        omit: {
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  return {
    props: { cardTypes },
  };
};

export function GachaPageList({ cardTypes }: GachaPageListProps) {
  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });

  return (
    <GachaHomeProvider cards={cardTypes}>
      <Flex maxH="100vh" flexDir={'column'}>
        <Warning />
        <Flex flex={1}>
          <Navbar />
          {!isMobile && <CardPreviewContainer />}
        </Flex>
      </Flex>
    </GachaHomeProvider>
  );
}

export default GachaPageList;
