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

import { ExpectedGamesSearchView } from '~/lundprod/components/my-space/expected-games/expected-games-search-view';
import { ExpectedGamesView } from '~/lundprod/components/my-space/expected-games/expected-games-view';
import { ExpectedGameProvider } from '~/lundprod/contexts/expected-games-context';
import {
  ExpectedGame,
  expectedGamesPrismaSelect,
} from '~/lundprod/utils/api/expected-games';

import { authOptions } from '../api/auth/[...nextauth]';
import { useTranslation } from 'react-i18next';

type PropsType = {
  expectedGames: ExpectedGame[];
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
      expectedGames: {
        select: expectedGamesPrismaSelect,
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
      expectedGames: JSON.parse(JSON.stringify(user.expectedGames)),
      session,
    },
  };
};

export function ExpectedGamesWrapper({ expectedGames }: PropsType) {
  const { t } = useTranslation();
  const selected = {
    color: 'orange.400',
    borderBottomColor: 'orange.400',
  };

  return (
    <ExpectedGameProvider expectedGames={expectedGames}>
      <Box maxW="1200px" m="auto" py="30px" px="15px">
        <Heading as="h1" variant="h1">
          {t('mySpace.expectedGames.awaitedGames')}
        </Heading>
        <Tabs>
          <TabList>
            <Tab _selected={selected} _active={{}}>
              {t('mySpace.expectedGames.myGames')}
            </Tab>
            <Tab _selected={selected} _active={{}}>
              {t('mySpace.expectedGames.findGame')}
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <ExpectedGamesView />
            </TabPanel>
            <TabPanel>
              <ExpectedGamesSearchView />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </ExpectedGameProvider>
  );
}

export default ExpectedGamesWrapper;
