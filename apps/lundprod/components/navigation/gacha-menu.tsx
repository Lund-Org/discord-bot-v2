import { TriangleDownIcon } from '@chakra-ui/icons';
import {
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react';
import { curry } from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { useClickAway, useMedia } from 'react-use';

import {
  getGachaRankingPage,
  getUserProfileUrl,
  isGachaListPage,
  isGachaPage,
  isGachaRankingPage,
  isUserGachaPage,
} from '~/lundprod/utils/url';

import { MenuLink } from './styled-components';

export const GachaMenu = ({ onClick }: { onClick: () => void }) => {
  const { pathname } = useRouter();
  const { data: session } = useSession();
  const ref = useRef(null);
  const [state, setState] = useState(false);
  // Don't use useBreakpointValue to have a default value as false
  const isMobile = useMedia('(max-width: 768px)', false);
  const gachaEntries = [
    { label: 'Introduction', href: '/gacha', isActive: isGachaPage },
    { label: 'Liste', href: '/gacha/list', isActive: isGachaListPage },
    {
      label: 'Classement',
      href: getGachaRankingPage(),
      isActive: isGachaRankingPage,
    },
    ...(session?.isPlayer
      ? [
          {
            label: 'Ma page',
            href: getUserProfileUrl(session.userId),
            isActive: curry(isUserGachaPage)(session.userId),
          },
        ]
      : []),
  ];

  // Debounce to keep the link working but close the popover
  useClickAway(ref, () => setTimeout(() => setState(false), 100));
  // Autoclose the mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (state && window.innerWidth < 768) {
        setState(false);
      }
    };

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  });

  if (isMobile) {
    return (
      <>
        {gachaEntries.map((entry, index) => (
          <MenuLink
            key={index}
            isActive={entry.isActive(pathname)}
            onClick={onClick}
          >
            <Link href={entry.href}>Gacha &gt; {entry.label}</Link>
          </MenuLink>
        ))}
      </>
    );
  }

  return (
    <Popover placement="bottom-start" isOpen={state} autoFocus={false}>
      <PopoverTrigger>
        <MenuLink isActive={isGachaPage(pathname, false)}>
          <Flex
            ref={ref}
            onClick={() => setState((s) => !s)}
            alignItems="center"
            color="orange.300"
            cursor="pointer"
          >
            <Text>Gacha</Text>
            <TriangleDownIcon w="10px" h="10px" ml="3px" />
          </Flex>
        </MenuLink>
      </PopoverTrigger>
      <PopoverContent w="auto" p="10px" bg="gray.800">
        <PopoverArrow bg="gray.800" />
        <PopoverBody>
          {gachaEntries.map((entry, index) => (
            <MenuLink
              key={index}
              isActive={entry.isActive(pathname)}
              onClick={() => setState(false)}
            >
              <Link href={entry.href}>{entry.label}</Link>
            </MenuLink>
          ))}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
