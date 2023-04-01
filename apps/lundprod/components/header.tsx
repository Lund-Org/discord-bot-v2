import { Button, Flex } from '@chakra-ui/react';
import { useClickAway } from 'react-use';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useEffect, useRef, useState } from 'react';
import { MENU_HEIGHT } from '~/lundprod/utils/constants';
import { MobileBox } from './visibility';
import { HomeMenu, GachaMenu, BlogMenu, SignMenu } from './navigation';
import { MenuBox } from './navigation/styled-components';
import { UserMenu } from './navigation/user-menu';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const Menus = [HomeMenu, GachaMenu, BlogMenu, UserMenu];
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
