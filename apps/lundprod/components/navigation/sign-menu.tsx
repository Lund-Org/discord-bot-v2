import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  Image,
  ListItem,
  Tag,
  Text,
  UnorderedList,
} from '@chakra-ui/react';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

import { getUserProfileUrl } from '~/lundprod/utils/url';

export const SignMenu = () => {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (status === 'loading') {
    return null;
  }

  const drawerItems = [
    ...(session?.isPlayer
      ? [{ label: 'Ma page gacha', link: getUserProfileUrl(session?.userId) }]
      : []),
    { label: 'Mon backlog', link: '/my-space/backlog' },
    {
      label: (
        <>
          <Text as="span">Mes jeux attendus</Text>
          <Tag
            ml="4px"
            size="sm"
            colorScheme="messenger"
            verticalAlign="baseline"
          >
            New !
          </Tag>
        </>
      ),
      link: '/my-space/expected-games',
    },
  ];

  return (
    <>
      <Flex
        ml="auto"
        alignItems="center"
        cursor="pointer"
        onClick={() =>
          session
            ? setIsOpen(true)
            : signIn('credentials', { callbackUrl: '/' })
        }
      >
        {session ? (
          <>
            {session?.user.image && (
              <Image
                maxW="35px"
                mr={4}
                src={session?.user.image}
                alt={session?.user?.name}
              />
            )}
            <Text>{session?.user?.name}</Text>
          </>
        ) : (
          'Connexion'
        )}
      </Flex>
      <Drawer
        onClose={() => setIsOpen(false)}
        isOpen={isOpen}
        placement="right"
      >
        <DrawerOverlay />
        <DrawerContent
          bg="gray.100"
          borderLeft="1px solid var(--chakra-colors-gray-600)"
        >
          <DrawerCloseButton />
          <DrawerHeader>{session?.user?.name}</DrawerHeader>

          <DrawerBody>
            <Heading as="h4" variant="h4" color="gray.800">
              Mes pages
            </Heading>
            <UnorderedList
              listStyleType="none"
              color="gray.600"
              fontWeight="600"
              ml={3}
            >
              {drawerItems.map((drawerItem, index) => (
                <ListItem
                  key={index}
                  sx={{
                    '&:hover a': {
                      paddingLeft: '5px',
                    },
                  }}
                  py="6px"
                >
                  <Link
                    href={drawerItem.link}
                    style={{
                      transition: 'all .3s ease',
                    }}
                    onClick={() => setIsOpen(false)}
                  >
                    {drawerItem.label}
                  </Link>
                </ListItem>
              ))}
            </UnorderedList>
          </DrawerBody>

          <DrawerFooter>
            <Button mr={3} onClick={() => setIsOpen(false)}>
              Fermer
            </Button>
            <Button colorScheme="orange" onClick={() => signOut()}>
              Deconnexion
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};
