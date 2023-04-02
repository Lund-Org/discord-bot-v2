import { ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Heading, Text, Tooltip } from '@chakra-ui/react';
import { prisma } from '@discord-bot-v2/prisma';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import { useState } from 'react';

import { GamepadIcon } from '~/lundprod/components/icons/gamepad';
import { ListIcon } from '~/lundprod/components/icons/list';

type UsersPageProps = {
  users: Array<{
    discordId: string;
    username: string;
    isPlayer: boolean;
    backlogItemsCount: number;
  }>;
};

export const getStaticProps: GetStaticProps<UsersPageProps> = async () => {
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
    },
    where: {
      isActive: true,
    },
    orderBy: {
      username: 'asc',
    },
  });

  const users = DBUsers.map((user) => {
    const { backlogItems, player, username, discordId } = user;

    return {
      username,
      discordId,
      isPlayer: !!player,
      backlogItemsCount: backlogItems.length,
    };
  });

  return {
    revalidate: 3600,
    props: {
      users,
    },
  };
};

export function UserProfilePage({ users }: UsersPageProps) {
  const [userOverId, setUserOverId] = useState<number | null>(null);

  const iconColorFn = (condition: boolean, index: number) => ({
    color: condition && userOverId === index ? 'orange.400' : 'gray.500',
  });

  return (
    <Box p="20px 50px">
      <Heading variant="h3">Utilisateurs :</Heading>
      <Flex flexDir="column" gap="16px" mt="30px" maxW="800px">
        {users.map((user, index) => (
          <Link key={user.discordId} href={`/u/${user.discordId}`}>
            <Flex
              borderRadius="4px"
              p="4px 20px"
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
              <Text>{user.username}</Text>
              <Box ml="auto" mr={0}>
                <Tooltip
                  label="Joueur de gacha"
                  bg="gray.200"
                  color="gray.900"
                  isDisabled={!user.isPlayer}
                  hasArrow
                >
                  <Button variant="third">
                    <GamepadIcon
                      boxSize={8}
                      {...iconColorFn(user.isPlayer, index)}
                    />
                  </Button>
                </Tooltip>
                <Tooltip
                  label="A un backlog"
                  bg="gray.200"
                  color="gray.900"
                  isDisabled={!user.backlogItemsCount}
                  hasArrow
                >
                  <Button variant="third" position="relative">
                    <ListIcon
                      boxSize={8}
                      {...iconColorFn(!!user.backlogItemsCount, index)}
                    />
                    <Flex
                      className="count"
                      position="absolute"
                      borderRadius="20px"
                      bottom={0}
                      right={0}
                      bg="gray.200"
                      color="gray.900"
                      w="20px"
                      h="20px"
                      fontSize="12px"
                      alignItems="center"
                      justifyContent="center"
                      {...(userOverId === index && user.backlogItemsCount
                        ? {
                            bg: 'orange.700',
                            color: 'gray.200',
                          }
                        : {})}
                    >
                      <span>{user.backlogItemsCount}</span>
                    </Flex>
                  </Button>
                </Tooltip>
                <Button variant="third">
                  <ChevronRightIcon boxSize={8} />
                </Button>
              </Box>
            </Flex>
          </Link>
        ))}
      </Flex>
    </Box>
  );
}

export default UserProfilePage;
