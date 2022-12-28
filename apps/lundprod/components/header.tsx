import {
  Box,
  BoxProps,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  PopoverTrigger,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useClickAway } from 'react-use';
import { HamburgerIcon, TriangleDownIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  isBlogPage,
  isGachaPage,
  isGachaListPage,
  isGachaRankingPage,
  isHomePage,
} from '../utils/url';
import { useRef, useState } from 'react';

type MenuUrlSingleItem = {
  label: string;
  href: string;
  isActive: (path: string) => boolean;
};

type MenuUrl = (
  | MenuUrlSingleItem
  | {
      label: string;
      isActive: (path: string) => boolean;
      menuChildren: MenuUrlSingleItem[];
    }
) &
  Partial<BoxProps>;

const activeProps = (isActive: boolean): Partial<BoxProps> =>
  isActive
    ? {
        color: 'orange.100',
        fontWeight: 'bold',
      }
    : {};

export const Header = () => {
  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });
  // const { pathname } = useRouter();
  const menuUrls: MenuUrl[] = [
    { label: 'Accueil', href: '/', isActive: isHomePage },
    {
      label: 'Gacha',
      isActive: isGachaPage,
      menuChildren: [
        { label: 'Liste', href: '/gacha', isActive: isGachaListPage },
        {
          label: 'Classement',
          href: '/gacha/ranking',
          isActive: isGachaRankingPage,
        },
      ],
    },
    { label: 'Blog', href: '/blog', isActive: isBlogPage },
  ];

  // if (pathname.startsWith('/gacha')) {
  //   menuUrls.push({
  //     label: 'Login',
  //     href: '/gacha/login',
  //     isActive: () => false,
  //     ml: 'auto',
  //   });
  // }

  return (
    <Flex
      bg="gray.700"
      borderBottom="1px solid"
      borderColor="gray.500"
      alignItems="center"
      w="100%"
      h="70px"
      px="20px"
      zIndex={9999}
    >
      <Box display={isMobile ? 'block' : 'none'}>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<HamburgerIcon />}
            variant="outline"
            bg="gray.200"
          />
          <MenuList bg="gray.800">
            {menuUrls.map((menuUrl, index) => (
              <MenuElementMobile key={index} menuUrl={menuUrl} />
            ))}
          </MenuList>
        </Menu>
      </Box>
      <Flex w="100%" display={!isMobile ? 'flex' : 'none'} gap="35px">
        {menuUrls.map((menuUrl, index) => (
          <MenuElement key={index} menuUrl={menuUrl} />
        ))}
      </Flex>
    </Flex>
  );
};

type MenuElementProps = {
  menuUrl: MenuUrl;
};

const MenuElement = ({ menuUrl }: MenuElementProps) => {
  const { pathname } = useRouter();
  const ref = useRef(null);
  const [state, setState] = useState(false);

  // Debounce to keep the link working but close the popover
  useClickAway(ref, () => setTimeout(() => setState(false), 100));

  if (isSingleItem(menuUrl)) {
    const { label, href, isActive, ...rest } = menuUrl;

    return (
      <Box color="orange.300" {...activeProps(isActive(pathname))} {...rest}>
        <Link href={href}>{label}</Link>
      </Box>
    );
  }

  return (
    <Popover placement="bottom-start" isOpen={state} autoFocus={false}>
      <PopoverTrigger>
        <Flex
          ref={ref}
          onClick={() => setState((s) => !s)}
          alignItems="center"
          color="orange.300"
          cursor="pointer"
          {...activeProps(menuUrl.isActive(pathname))}
        >
          <Text>{menuUrl.label}</Text>
          <TriangleDownIcon w="10px" h="10px" ml="3px" />
        </Flex>
      </PopoverTrigger>
      <PopoverContent w="auto" p="10px" bg="gray.800">
        <PopoverArrow bg="gray.800" />
        <PopoverBody>
          {menuUrl.menuChildren.map((child, index) => (
            <Box key={index} onClick={() => setState(false)}>
              <MenuElement key={index} menuUrl={child} />
            </Box>
          ))}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

const MenuElementMobile = ({ menuUrl }: MenuElementProps) => {
  const { pathname } = useRouter();

  const SingleElement = ({ element }: { element: MenuUrlSingleItem }) => {
    const { label, href, isActive } = element;

    return (
      <MenuItem bg="transparent">
        <Box py="5px" color="orange.300" {...activeProps(isActive(pathname))}>
          <Link href={href}>{label}</Link>
        </Box>
      </MenuItem>
    );
  };

  if (isSingleItem(menuUrl)) {
    return <SingleElement element={menuUrl} />;
  }

  return (
    <>
      {menuUrl.menuChildren.map((child, index) => (
        <SingleElement
          key={index}
          element={{ ...child, label: `${menuUrl.label} > ${child.label}` }}
        />
      ))}
    </>
  );
};

function isSingleItem(item: MenuUrl): item is MenuUrlSingleItem {
  return 'href' in item;
}
