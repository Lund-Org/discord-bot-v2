import { ChevronRightIcon, TimeIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Heading, Text, Tooltip } from '@chakra-ui/react';
import { prisma } from '@discord-bot-v2/prisma';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { GamepadIcon } from '~/lundprod/components/icons/gamepad';
import { ListIcon } from '~/lundprod/components/icons/list';
import { TooltipIconIndicator } from '~/lundprod/components/users/tooltip-icon-indicator';

type UsersPageProps = {
  users: Array<{
    discordId: string;
    username: string;
    isPlayer: boolean;
    backlogItemsCount: number;
    expectedGamesCount: number;
  }>;
};

export const getServerSideProps: GetServerSideProps<
  UsersPageProps
> = async () => {
  const DBUsers = await prisma.user.findMany({
    select: {
      discordId: true,
      username: true,
      player: { select: { id: true } },
      backlogItems: {
        select: {
          id: true,
        },
      },
      expectedGames: {
        select: {
          id: true,
        },
      },
    },
    where: {
      isActive: true,
    },
    orderBy: {
      username: 'asc',
    },
  });

  const users = DBUsers.map((user) => {
    const { backlogItems, expectedGames, player, username, discordId } = user;

    return {
      username,
      discordId,
      isPlayer: !!player,
      backlogItemsCount: backlogItems.length,
      expectedGamesCount: expectedGames.length,
    };
  }).filter(
    ({ isPlayer, backlogItemsCount, expectedGamesCount }) =>
      isPlayer || backlogItemsCount || expectedGamesCount,
  );

  return {
    props: {
      users,
    },
  };
};

export function UserProfilePage({ users }: UsersPageProps) {
  const { t } = useTranslation();
  const [userOverId, setUserOverId] = useState<number | null>(null);

  const iconColorFn = (condition: boolean, index: number) => ({
    color: condition && userOverId === index ? 'orange.400' : 'gray.500',
  });

  return (
    <Box p={{ base: '10px 20px', md: '20px 50px' }}>
      <Heading variant="h3">{t('userList.title')}</Heading>
      <Flex flexDir="column" gap="16px" mt="30px" maxW="800px">
        {users.map((user, index) => (
          <Link key={user.discordId} href={`/u/${user.discordId}`}>
            <Box
              display="flex"
              borderRadius="4px"
              p={['4px', '4px 20px']}
              w={{ base: 'fit-content', md: 'auto' }}
              border="1px solid"
              borderColor="gray.700"
              alignItems="center"
              _hover={{
                color: 'orange.400',
                borderColor: 'orange.600',
                background: 'whiteAlpha.200',
              }}
              cursor="pointer"
              onMouseEnter={() => setUserOverId(index)}
              onMouseLeave={() => setUserOverId(null)}
            >
              <Text pl={[2, 0]}>{user.username}</Text>
              <Box ml="auto" mr={0}>
                <Tooltip
                  label="Joueur de gacha"
                  bg="gray.200"
                  color="gray.900"
                  isDisabled={!user.isPlayer}
                  hasArrow
                >
                  <Button variant="third" px={[2, 4]}>
                    <GamepadIcon
                      boxSize={[6, 8]}
                      {...iconColorFn(user.isPlayer, index)}
                    />
                  </Button>
                </Tooltip>
                <TooltipIconIndicator
                  tooltipLabel="A un backlog"
                  icon={
                    <ListIcon
                      boxSize={[6, 8]}
                      {...iconColorFn(!!user.backlogItemsCount, index)}
                    />
                  }
                  count={user.backlogItemsCount}
                  hover={!!(userOverId === index && user.backlogItemsCount)}
                  isDisabled={!user.backlogItemsCount}
                />
                <TooltipIconIndicator
                  tooltipLabel="Attend des jeux"
                  icon={
                    <TimeIcon
                      boxSize={[6, 8]}
                      {...iconColorFn(!!user.expectedGamesCount, index)}
                    />
                  }
                  count={user.expectedGamesCount}
                  hover={!!(userOverId === index && user.expectedGamesCount)}
                  isDisabled={!user.expectedGamesCount}
                />
                <Button variant="third" px={[2, 4]}>
                  <ChevronRightIcon boxSize={8} />
                </Button>
              </Box>
            </Box>
          </Link>
        ))}
      </Flex>
    </Box>
  );
}

export default UserProfilePage;
