import {
  Box,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { prisma } from '@discord-bot-v2/prisma';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';

import { BacklogGameSearchView } from '~/lundprod/components/my-space/backlog/backlog-game-search-view';
import { BacklogList } from '~/lundprod/components/my-space/backlog/backlog-list';
import {
  BacklogItemLight,
  BacklogProvider,
} from '~/lundprod/contexts/backlog-context';
import { backlogItemPrismaFields } from '~/lundprod/utils/api/backlog';

import { authOptions } from '../api/auth/[...nextauth]';

type PropsType = {
  backlog: BacklogItemLight[];
};

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
    select: {
      backlogItems: {
        select: backlogItemPrismaFields,
        orderBy: {
          order: 'asc',
        },
      },
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

  return {
    props: {
      backlog: user.backlogItems,
      session,
    },
  };
};

export function BacklogWrapper({ backlog }: PropsType) {
  const selected = {
    color: 'orange.400',
    borderBottomColor: 'orange.400',
  };

  return (
    <BacklogProvider backlog={backlog}>
      <Box maxW="1200px" m="auto" py="30px" px="15px">
        <Heading as="h1" variant="h1">
          Backlog
        </Heading>
        <Tabs>
          <TabList>
            <Tab _selected={selected} _active={{}}>
              Ma liste
            </Tab>
            <Tab _selected={selected} _active={{}}>
              Trouver un jeu
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <BacklogList isReadOnly={false} />
            </TabPanel>
            <TabPanel>
              <BacklogGameSearchView />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </BacklogProvider>
  );
}

export default BacklogWrapper;
