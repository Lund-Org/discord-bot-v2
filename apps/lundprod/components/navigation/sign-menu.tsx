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
  Text,
  Tooltip,
  UnorderedList,
} from '@chakra-ui/react';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

import { getUserProfileUrl } from '~/lundprod/utils/url';
import { useTranslation } from 'react-i18next';

export const SignMenu = () => {
  const { t } = useTranslation();
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (status === 'loading') {
    return null;
  }

  const drawerItems = [
    ...(session?.isPlayer
      ? [
          {
            label: t('menu.sign.myGacha'),
            link: getUserProfileUrl(session?.userId),
          },
        ]
      : []),
    { label: t('menu.sign.myBacklog'), link: '/my-space/backlog' },
    {
      label: t('menu.sign.myExpectedGames'),
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
                fallback={
                  <Tooltip
                    label={t('menu.sign.avatarError')}
                    placement="bottom-end"
                    border="1px solid"
                    borderColor="gray.500"
                  >
                    <Image
                      maxW="35px"
                      mr={4}
                      src={`https://via.placeholder.com/100x100/ffae00/333333?text=${
                        session?.user?.name[0] || 'Ø'
                      }`}
                      alt={session?.user?.name}
                    />
                  </Tooltip>
                }
              />
            )}
            <Text textTransform="capitalize">{session?.user?.name}</Text>
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
          <DrawerHeader color="gray.800" textTransform="capitalize">
            {session?.user?.name}
          </DrawerHeader>

          <DrawerBody>
            <Heading as="h4" variant="h4" color="gray.800">
              {t('menu.sign.myPages')}
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
            <Button
              mr={3}
              onClick={() => setIsOpen(false)}
              colorScheme="blackAlpha"
            >
              {t('menu.sign.close')}
            </Button>
            <Button colorScheme="orange" onClick={() => signOut()}>
              {t('menu.sign.signout')}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};
