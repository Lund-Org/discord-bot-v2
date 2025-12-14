import { HamburgerIcon } from '@chakra-ui/icons';
import { Button, Flex } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { useClickAway } from 'react-use';

import { MENU_HEIGHT } from '~/lundprod/utils/constants';

import { BlogMenu, GachaMenu, HomeMenu, SignMenu } from './navigation';
import { ContactMenu } from './navigation/contact-menu';
import { ProjectMenu } from './navigation/project-menu';
import { MenuBox } from './navigation/styled-components';
import { UserMenu } from './navigation/user-menu';
import { MobileBox } from './visibility';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const Menus = [
    HomeMenu,
    GachaMenu,
    BlogMenu,
    UserMenu,
    ProjectMenu,
    ContactMenu,
  ];
  const ref = useRef();

  useClickAway(ref, () => setTimeout(() => setIsMenuOpen(false), 100));

  // Autoclose the mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (isMenuOpen && window.innerWidth > 767) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  });

  return (
    <Flex
      bg="gray.700"
      borderBottom="1px solid"
      borderColor="gray.500"
      w="100%"
      zIndex={1300}
      h={MENU_HEIGHT}
      color="orange.300"
      px="20px"
      position="fixed"
      top={0}
      left={0}
      right={0}
    >
      <Flex ref={ref} flex={1} h="100%" alignItems="center" position="relative">
        <MobileBox>
          <Button
            variant="outline"
            bg="gray.200"
            onClick={() => setIsMenuOpen((v) => !v)}
            color="gray.700"
          >
            <HamburgerIcon />
          </Button>
        </MobileBox>
        <MenuBox isOpen={isMenuOpen}>
          {Menus.map((Component, index) => (
            <Component key={index} onClick={() => setIsMenuOpen(false)} />
          ))}
        </MenuBox>
      </Flex>
      <SignMenu />
    </Flex>
  );
};
