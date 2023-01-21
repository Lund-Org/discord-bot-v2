import { prisma } from '@discord-bot-v2/prisma';
import {
  Box,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]';
import {
  BacklogItemLight,
  BacklogProvider,
} from '../../contexts/backlog-context';
import { GameChoiceTab } from '../../components/my-space/backlog/game-choice-tab';
import { BacklogList } from '../../components/my-space/backlog/backlog-list';

type PropsType = {
  backlog: BacklogItemLight[];
};

export const getServerSideProps: GetServerSideProps<PropsType> = async ({
  req,
  res,
}) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const player = await prisma.player.findUnique({
    where: {
      discordId: session.userId,
    },
    select: {
      backlogItems: {
        select: {
          igdbGameId: true,
          name: true,
          category: true,
          url: true,
        },
      },
    },
  });

  if (!player) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      backlog: player.backlogItems,
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
            <Tab _selected={selected}>Ma liste</Tab>
            <Tab _selected={selected}>Trouver un jeu</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <BacklogList />
            </TabPanel>
            <TabPanel>
              <GameChoiceTab />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </BacklogProvider>
  );
}

export default BacklogWrapper;